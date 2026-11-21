import { unzipSync } from 'fflate';
import { getGameBuildUploadTargets } from './project';

const MAX_ZIP_SIZE = 200 * 1024 * 1024;
const MAX_BUILD_SIZE = 300 * 1024 * 1024;

const isMacMetadataPath = (path) => path.split('/').some((segment) =>
  segment === '__MACOSX' || segment === '.DS_Store' || segment.startsWith('._'));

const readZipMetadata = (bytes) => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const minimumOffset = Math.max(0, bytes.byteLength - 65_557);
  let endRecordOffset = -1;
  for (let offset = bytes.byteLength - 22; offset >= minimumOffset; offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      endRecordOffset = offset;
      break;
    }
  }
  if (endRecordOffset < 0) throw new Error('ZIP 파일의 디렉터리를 읽을 수 없습니다.');

  const disk = view.getUint16(endRecordOffset + 4, true);
  const directoryDisk = view.getUint16(endRecordOffset + 6, true);
  const diskEntryCount = view.getUint16(endRecordOffset + 8, true);
  const entryCount = view.getUint16(endRecordOffset + 10, true);
  const directorySize = view.getUint32(endRecordOffset + 12, true);
  const directoryOffset = view.getUint32(endRecordOffset + 16, true);
  const commentLength = view.getUint16(endRecordOffset + 20, true);
  if (disk !== 0 || directoryDisk !== 0 || diskEntryCount !== entryCount || entryCount === 0xffff
      || endRecordOffset + 22 + commentLength !== bytes.byteLength
      || directoryOffset + directorySize > endRecordOffset) {
    throw new Error('분할되었거나 지원하지 않는 ZIP 형식입니다.');
  }
  if (entryCount > 500) throw new Error('게임 파일은 500개 이하로 업로드할 수 있습니다.');

  let offset = directoryOffset;
  let totalSize = 0;
  for (let index = 0; index < entryCount; index += 1) {
    if (offset + 46 > bytes.byteLength || view.getUint32(offset, true) !== 0x02014b50) {
      throw new Error('ZIP 파일 목록이 올바르지 않습니다.');
    }
    const flags = view.getUint16(offset + 8, true);
    const uncompressedSize = view.getUint32(offset + 24, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const entryCommentLength = view.getUint16(offset + 32, true);
    if ((flags & 1) !== 0 || uncompressedSize === 0xffffffff) {
      throw new Error('암호화되었거나 ZIP64 형식인 게임 빌드는 지원하지 않습니다.');
    }
    totalSize += uncompressedSize;
    if (totalSize > MAX_BUILD_SIZE) {
      throw new Error('압축을 푼 게임 파일은 총 300MB 이하만 업로드할 수 있습니다.');
    }
    offset += 46 + nameLength + extraLength + entryCommentLength;
  }
  if (offset > directoryOffset + directorySize) throw new Error('ZIP 파일 목록이 손상되었습니다.');
};

const uploadInBatches = async (files, targets, batchSize = 4) => {
  const targetByPath = new Map(targets.map((target) => [target.path, target]));
  for (let index = 0; index < files.length; index += batchSize) {
    const batch = files.slice(index, index + batchSize);
    await Promise.all(batch.map(async ({ path, data }) => {
      const target = targetByPath.get(path);
      if (!target) throw new Error(`업로드 주소를 찾을 수 없습니다: ${path}`);
      const headers = { 'Content-Type': target.contentType };
      if (target.contentEncoding) headers['Content-Encoding'] = target.contentEncoding;
      const response = await fetch(target.uploadURL, { method: 'PUT', headers, body: data });
      if (!response.ok) {
        const errorBody = await response.text();
        const code = errorBody.match(/<Code>([^<]+)<\/Code>/)?.[1];
        const message = errorBody.match(/<Message>([^<]+)<\/Message>/)?.[1];
        const details = [code, message].filter(Boolean).join(': ');
        throw new Error(`${path} 업로드에 실패했습니다 (${response.status})${details ? ` · ${details}` : ''}`);
      }
    }));
  }
};

export const uploadGameBuildZip = async (zipFile) => {
  if (!zipFile || !zipFile.name.toLowerCase().endsWith('.zip')) {
    throw new Error('게임 빌드를 ZIP 파일로 선택해 주세요.');
  }
  if (zipFile.size > MAX_ZIP_SIZE) {
    throw new Error('ZIP 파일은 200MB 이하만 업로드할 수 있습니다.');
  }

  let extracted;
  try {
    const zipBytes = new Uint8Array(await zipFile.arrayBuffer());
    readZipMetadata(zipBytes);
    extracted = unzipSync(zipBytes);
  } catch (error) {
    throw new Error(error.message || 'ZIP 압축을 풀 수 없습니다. 암호화되지 않은 ZIP인지 확인해 주세요.');
  }

  const files = Object.entries(extracted)
    .filter(([path]) => !path.endsWith('/') && !isMacMetadataPath(path))
    .map(([path, data]) => ({ path, data }));
  const totalSize = files.reduce((sum, file) => sum + file.data.byteLength, 0);
  if (files.length === 0) throw new Error('ZIP 안에 게임 파일이 없습니다.');
  if (files.length > 500) throw new Error('게임 파일은 500개 이하로 업로드할 수 있습니다.');
  if (totalSize > MAX_BUILD_SIZE) throw new Error('압축을 푼 게임 파일은 총 300MB 이하만 업로드할 수 있습니다.');

  const entrypoints = files.filter(({ path }) => path.split('/').pop().toLowerCase() === 'index.html');
  if (entrypoints.length !== 1) {
    throw new Error(entrypoints.length === 0
      ? 'ZIP 안에서 index.html을 찾지 못했습니다.'
      : 'index.html이 여러 개 있습니다. 실행할 HTML 파일 하나만 포함해 주세요.');
  }

  const { data } = await getGameBuildUploadTargets({
    files: files.map(({ path, data: fileData }) => ({ path, size: fileData.byteLength })),
    entrypoint: entrypoints[0].path,
  });
  await uploadInBatches(files, data.uploads);
  return data.gameURL;
};
