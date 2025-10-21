import { FC, useContext } from 'react';
import { Chunk, SourceEntry, SourceReference, SourcesProps } from '../../types';
import { LoadingSpinner, TextLink, Typography } from '@neo4j-ndl/react';
import { DocumentTextIconOutline, GlobeAltIconOutline } from '@neo4j-ndl/react/icons';
import {
  getLogo,
  getProjectDisplayName,
  isAllowedHost,
  youtubeLinkValidation,
  url as getBackendUrl,
} from '../../utils/Utils';
import { ThemeWrapperContext } from '../../context/ThemeWrapper';
import HoverableLink from '../UI/HoverableLink';
import wikipedialogo from '../../assets/images/wikipedia.svg';
import youtubelogo from '../../assets/images/youtube.svg';
import gcslogo from '../../assets/images/gcs.webp';
import s3logo from '../../assets/images/s3logo.png';

const filterUniqueChunks = (chunks: Chunk[]) => {
  const chunkSource = new Set();
  return chunks.filter((chunk) => {
    const sourceCheck = `${chunk.fileName}-${chunk.fileSource}`;
    if (chunkSource.has(sourceCheck)) {
      return false;
    }
    chunkSource.add(sourceCheck);
    return true;
  });
};

const isSourceEntry = (source: SourceReference): source is SourceEntry => {
  return typeof source === 'object' && source !== null && 'download_url' in source;
};

const getSourceUrl = (source: SourceReference): string | undefined => {
  return typeof source === 'string' ? source : source.source;
};

const getSourceLabel = (source: SourceReference): string => {
  if (typeof source === 'string') {
    return source;
  }
  return source.label || source.source || source.sanitized_filename;
};

const getDownloadHref = (source: SourceReference, backendBaseUrl: string): string | undefined => {
  if (!isSourceEntry(source)) {
    return undefined;
  }
  const downloadPath = source.download_url;
  if (!downloadPath) {
    return undefined;
  }
  return downloadPath.startsWith('http') ? downloadPath : `${backendBaseUrl}${downloadPath}`;
};

const SourcesInfo: FC<SourcesProps> = ({ loading, mode, chunks, sources }) => {
  const themeUtils = useContext(ThemeWrapperContext);
  const uniqueChunks = chunks ? filterUniqueChunks(chunks) : [];
  const backendBaseUrl = getBackendUrl();
  return (
    <>
      {loading ? (
        <div className='flex justify-center items-center'>
          <LoadingSpinner size='small' />
        </div>
      ) : mode === 'entity search+vector' && uniqueChunks.length ? (
        <ul>
          {uniqueChunks.map((chunk, index) => {
            const projectName = getProjectDisplayName(
              chunk.project,
              chunk.gcsProjectId,
              chunk.googleProjectId
            );
            return (
              <li key={index} className='flex! flex-row justify-between items-center p-2'>
                <div className='flex! flex-row  justify-between items-center'>
                  {chunk.fileSource === 'local file' ? (
                    <DocumentTextIconOutline className='n-size-token-7 mr-2' />
                  ) : (
                    <img
                      src={getLogo(themeUtils.colorMode)[chunk.fileSource]}
                      width={20}
                      height={20}
                      className='mr-2'
                      alt='source-logo'
                    />
                  )}
                  <div className='flex flex-col overflow-hidden'>
                    <Typography
                      variant='body-medium'
                      className='text-ellipsis whitespace-nowrap overflow-hidden max-w-lg'
                    >
                      {chunk.fileName}
                    </Typography>
                    <Typography
                      variant='body-small'
                      className='text-palette-neutral-text-weak text-ellipsis whitespace-nowrap overflow-hidden max-w-lg'
                    >
                      Project: {projectName}
                    </Typography>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : sources?.length ? (
        <ul className='list-class list-none'>
          {sources.map((sourceItem, index) => {
            const sourceUrl = getSourceUrl(sourceItem);
            const label = getSourceLabel(sourceItem);
            const downloadHref = getDownloadHref(sourceItem, backendBaseUrl);
            const sanitizedFilename = isSourceEntry(sourceItem) ? sourceItem.sanitized_filename : undefined;

            const isHttpLink = typeof sourceUrl === 'string' &&
              (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://'));
            const isS3Link = typeof sourceUrl === 'string' && sourceUrl.startsWith('s3://');
            const isWikipediaLink = isHttpLink && sourceUrl != null && isAllowedHost(sourceUrl, ['wikipedia.org']);
            const isGcsLink = isHttpLink && sourceUrl != null && isAllowedHost(sourceUrl, ['storage.googleapis.com']);
            const isYoutubeLink = isHttpLink && sourceUrl != null && youtubeLinkValidation(sourceUrl);
            const isGenericWebLink = isHttpLink && !isWikipediaLink && !isGcsLink && !isYoutubeLink;

            const gcsDisplayLabel =
              (isSourceEntry(sourceItem) && sourceItem.label) ||
              (sourceUrl ? decodeURIComponent(sourceUrl).split('/').at(-1)?.split('?')[0] : label) ||
              label;

            const s3DisplayLabel =
              (isSourceEntry(sourceItem) && sourceItem.label) ||
              (sourceUrl ? decodeURIComponent(sourceUrl).split('/').at(-1) : label) ||
              label;

            const content = (() => {
              if (isHttpLink && sourceUrl) {
                if (isWikipediaLink) {
                  return (
                    <div className='flex! flex-row justify-between items-center'>
                      <img src={wikipedialogo} width={20} height={20} className='mr-2' alt='Wikipedia Logo' />
                      <TextLink href={sourceUrl} type='external' target='_blank'>
                        <HoverableLink url={sourceUrl}>
                          <Typography
                            variant='body-medium'
                            className='text-ellipsis whitespace-nowrap overflow-hidden max-w-lg'
                          >
                            {label}
                          </Typography>
                        </HoverableLink>
                      </TextLink>
                    </div>
                  );
                }
                if (isGcsLink) {
                  return (
                    <div className='flex! flex-row justify-between items-center'>
                      <img src={gcslogo} width={20} height={20} className='mr-2' alt='Google Cloud Storage Logo' />
                      <Typography
                        variant='body-medium'
                        className='text-ellipsis whitespace-nowrap overflow-hidden max-w-lg'
                      >
                        {gcsDisplayLabel}
                      </Typography>
                    </div>
                  );
                }
                if (isYoutubeLink) {
                  return (
                    <div className='flex! flex-row justiy-between items-center'>
                      <img src={youtubelogo} width={20} height={20} className='mr-2' alt='youtube-source-logo' />
                      <TextLink href={sourceUrl} type='external' target='_blank'>
                        <HoverableLink url={sourceUrl}>
                          <Typography
                            variant='body-medium'
                            className='text-ellipsis whitespace-nowrap overflow-hidden max-w-lg'
                          >
                            {label}
                          </Typography>
                        </HoverableLink>
                      </TextLink>
                    </div>
                  );
                }
                if (isGenericWebLink) {
                  return (
                    <div className='flex! flex-row justify-between items-center'>
                      <GlobeAltIconOutline className='n-size-token-7' />
                      <TextLink href={sourceUrl} type='external' target='_blank'>
                        <HoverableLink url={sourceUrl}>
                          <Typography variant='body-medium'>{label}</Typography>
                        </HoverableLink>
                      </TextLink>
                    </div>
                  );
                }
              }

              if (isS3Link && sourceUrl) {
                return (
                  <div className='flex! flex-row justify-between items-center'>
                    <img src={s3logo} width={20} height={20} className='mr-2' alt='S3 Logo' />
                    <Typography
                      variant='body-medium'
                      className='text-ellipsis whitespace-nowrap overflow-hidden max-w-lg'
                    >
                      {s3DisplayLabel}
                    </Typography>
                  </div>
                );
              }

              return (
                <div className='flex! flex-row justify-between items-center'>
                  <DocumentTextIconOutline className='n-size-token-7 mr-2' />
                  <Typography
                    variant='body-medium'
                    className='text-ellipsis whitespace-nowrap overflow-hidden max-w-lg'
                  >
                    {label}
                  </Typography>
                </div>
              );
            })();

            return (
              <li key={index} className='flex! flex-row justify-between items-center p-2'>
                <div className='flex! flex-row justify-between items-center w-full gap-2'>
                  <div className='flex! flex-row justify-between items-center min-w-0'>{content}</div>
                  {downloadHref && (
                    <TextLink
                      href={downloadHref}
                      type='external'
                      target='_blank'
                      rel='noreferrer'
                      download={sanitizedFilename}
                      className='whitespace-nowrap'
                    >
                      Download
                    </TextLink>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <span className='h6 text-center'>No Sources Found</span>
      )}
    </>
  );
};
export default SourcesInfo;
