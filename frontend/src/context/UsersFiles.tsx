import { createContext, useContext, useState, FC, useEffect } from 'react';
import {
  CustomFile,
  FileContextProviderProps,
  FileContextType,
  OptionType,
  showTextFromSchemaDialogType,
  schemaLoadDialogType,
  predefinedSchemaDialogType,
  dataImporterSchemaDialogType,
} from '../types';
import {
  chatModeLables,
  getStoredSchema,
  llms,
  PRODMODLES,
  chunkOverlap,
  chunksToCombine,
  tokenchunkSize,
} from '../utils/Constants';
import { useCredentials } from './UserCredentials';
import Queue from '../utils/Queue';
import { updateLocalStorage } from '../utils/Utils';
import {
  OUTPUT_MARKDOWN_SCHEMA_VERSION,
  OUTPUT_MARKDOWN_SCHEMA_VERSION_KEY,
  hasOutputMarkdownSchema,
  outputMarkdownNodeOptions,
  outputMarkdownPatterns,
  outputMarkdownRelationshipOptions,
  outputMarkdownSchemaOption,
  outputMarkdownSelectedSchemaOptions,
} from '../utils/outputMarkdownSchema';

const FileContext = createContext<FileContextType | undefined>(undefined);

const FileContextProvider: FC<FileContextProviderProps> = ({ children }) => {
  const isProdEnv = process.env.VITE_ENV === 'PROD';
  const selectedTokenChunkSizeStr = localStorage.getItem('selectedTokenChunkSize');
  const selectedChunk_overlapStr = localStorage.getItem('selectedChunk_overlap');
  const selectedChunks_to_combineStr = localStorage.getItem('selectedChunks_to_combine');
  const persistedQueue = localStorage.getItem('waitingQueue');
  const selectedModel = localStorage.getItem('selectedModel');
  const selectedInstructstr = localStorage.getItem('instructions');
  const isProdDefaultModel = isProdEnv && selectedModel && PRODMODLES.includes(selectedModel);
  const { userCredentials } = useCredentials();
  const [files, setFiles] = useState<(File | null)[] | []>([]);
  const [filesData, setFilesData] = useState<CustomFile[] | []>([]);
  const [queue, setQueue] = useState<Queue<CustomFile>>(
    new Queue(JSON.parse(persistedQueue ?? JSON.stringify({ queue: [] })).queue)
  );
  const [model, setModel] = useState<string>(isProdDefaultModel ? selectedModel : isProdEnv ? PRODMODLES[0] : llms[0]);
  const [graphType, setGraphType] = useState<string>('Knowledge Graph Entities');
  const [selectedNodes, setSelectedNodes] = useState<readonly OptionType[]>(() =>
    outputMarkdownNodeOptions.length ? Array.from(outputMarkdownNodeOptions) : []
  );
  const [selectedRels, setSelectedRels] = useState<readonly OptionType[]>(() =>
    outputMarkdownRelationshipOptions.length ? Array.from(outputMarkdownRelationshipOptions) : []
  );
  const [selectedTokenChunkSize, setSelectedTokenChunkSize] = useState<number>(tokenchunkSize);
  const [selectedChunk_overlap, setSelectedChunk_overlap] = useState<number>(chunkOverlap);
  const [selectedChunks_to_combine, setSelectedChunks_to_combine] = useState<number>(chunksToCombine);
  const [selectedSchemas, setSelectedSchemas] = useState<readonly OptionType[]>(() =>
    getStoredSchema(Array.from(outputMarkdownSelectedSchemaOptions))
  );
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [chatModes, setchatModes] = useState<string[]>([chatModeLables['graph+vector+fulltext']]);

  const [showTextFromSchemaDialog, setShowTextFromSchemaDialog] = useState<showTextFromSchemaDialogType>({
    triggeredFrom: '',
    show: false,
  });
  const [schemaLoadDialog, setSchemaLoadDialog] = useState<schemaLoadDialogType>({
    triggeredFrom: '',
    show: false,
  });

  const [predefinedSchemaDialog, setPredefinedSchemaDialog] = useState<predefinedSchemaDialogType>({
    triggeredFrom: '',
    show: false,
  });

  const [dataImporterSchemaDialog, setDataImporterSchemaDialog] = useState<dataImporterSchemaDialogType>({
    triggeredFrom: '',
    show: false,
  });

  const [postProcessingTasks, setPostProcessingTasks] = useState<string[]>([
    'materialize_text_chunk_similarities',
    'enable_hybrid_search_and_fulltext_search_in_bloom',
    'materialize_entity_similarities',
    'enable_communities',
  ]);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [postProcessingVal, setPostProcessingVal] = useState<boolean>(false);
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  const [schemaTextPattern, setSchemaTextPattern] = useState<string[]>([]);
  const [allPatterns, setAllPatterns] = useState<string[]>(() => {
    if (!outputMarkdownRelationshipOptions.length) {
      return [];
    }
    return Array.from(outputMarkdownRelationshipOptions).map((rel) => {
      const [source, type, target] = rel.value.split(',');
      return `(${source})-[${type}]->(${target})`;
    });
  });
  const [userDefinedPattern, setUserDefinedPattern] = useState<string[]>([]);
  const [dbPattern, setDbPattern] = useState<string[]>([]);
  const [schemaValNodes, setSchemaValNodes] = useState<OptionType[]>([]);
  const [schemaValRels, setSchemaValRels] = useState<OptionType[]>([]);
  const [dbNodes, setDbNodes] = useState<OptionType[]>([]);
  const [dbRels, setDbRels] = useState<OptionType[]>([]);
  const [preDefinedNodes, setPreDefinedNodes] = useState<OptionType[]>(() =>
    outputMarkdownNodeOptions.length ? Array.from(outputMarkdownNodeOptions) : []
  );
  const [preDefinedRels, setPreDefinedRels] = useState<OptionType[]>(() =>
    outputMarkdownRelationshipOptions.length ? Array.from(outputMarkdownRelationshipOptions) : []
  );
  const [userDefinedNodes, setUserDefinedNodes] = useState<OptionType[]>([]);
  const [userDefinedRels, setUserDefinedRels] = useState<OptionType[]>([]);
  const [preDefinedPattern, setPreDefinedPattern] = useState<string[]>(() =>
    outputMarkdownPatterns.length ? Array.from(outputMarkdownPatterns) : []
  );
  const [selectedPreDefOption, setSelectedPreDefOption] = useState<OptionType | null>(() =>
    outputMarkdownSchemaOption ? { ...outputMarkdownSchemaOption } : null
  );
  const [sourceOptions, setSourceOptions] = useState<OptionType[]>([]);
  const [typeOptions, setTypeOptions] = useState<OptionType[]>([]);
  const [targetOptions, setTargetOptions] = useState<OptionType[]>([]);

  // Importer schema
  const [importerNodes, setImporterNodes] = useState<OptionType[]>([]);
  const [importerRels, setImporterRels] = useState<OptionType[]>([]);
  const [importerPattern, setImporterPattern] = useState<string[]>([]);

  useEffect(() => {
    if (!userCredentials) {
      return;
    }

    const defaultNodeOptions = Array.from(outputMarkdownNodeOptions);
    const defaultRelationshipOptions = Array.from(outputMarkdownRelationshipOptions);
    const defaultPatternList =
      outputMarkdownPatterns.length > 0
        ? Array.from(outputMarkdownPatterns)
        : defaultRelationshipOptions.map((rel) => {
            const [source, type, target] = rel.value.split(',');
            return `(${source})-[${type}]->(${target})`;
          });
    const defaultSchemaSelection = Array.from(outputMarkdownSelectedSchemaOptions);
    const defaultPredefinedOption = outputMarkdownSchemaOption ? { ...outputMarkdownSchemaOption } : null;

    let defaultsApplied = false;

    const applyDefaultNodes = () => {
      if (!defaultNodeOptions.length) {
        setSelectedNodes([]);
        updateLocalStorage(userCredentials, 'selectedNodeLabels', []);
        return;
      }
      setSelectedNodes(defaultNodeOptions);
      updateLocalStorage(userCredentials, 'selectedNodeLabels', defaultNodeOptions);
    };

    const applyDefaultRelationships = () => {
      if (!defaultRelationshipOptions.length) {
        setSelectedRels([]);
        setAllPatterns([]);
        updateLocalStorage(userCredentials, 'selectedRelationshipLabels', []);
        updateLocalStorage(userCredentials, 'selectedPattern', []);
        return;
      }
      setSelectedRels(defaultRelationshipOptions);
      setAllPatterns(defaultPatternList);
      updateLocalStorage(userCredentials, 'selectedRelationshipLabels', defaultRelationshipOptions);
      updateLocalStorage(userCredentials, 'selectedPattern', defaultPatternList);
    };

    const applyDefaultSchemasOnly = () => {
      if (defaultSchemaSelection.length) {
        setSelectedSchemas(defaultSchemaSelection);
        updateLocalStorage(userCredentials, 'selectedSchemas', defaultSchemaSelection);
      } else {
        setSelectedSchemas([]);
        updateLocalStorage(userCredentials, 'selectedSchemas', []);
      }
      defaultsApplied = true;
    };

    const applyPredefinedDefaults = () => {
      setPreDefinedNodes(defaultNodeOptions);
      setPreDefinedRels(defaultRelationshipOptions);
      setPreDefinedPattern(defaultPatternList);
      setSelectedPreDefOption(defaultPredefinedOption);
    };

    const applyOutputMarkdownDefaults = () => {
      applyDefaultNodes();
      applyDefaultRelationships();
      applyDefaultSchemasOnly();
      applyPredefinedDefaults();
    };

    const storedSchemaVersion = localStorage.getItem(OUTPUT_MARKDOWN_SCHEMA_VERSION_KEY);
    const shouldForceDefaults =
      hasOutputMarkdownSchema &&
      defaultNodeOptions.length > 0 &&
      defaultRelationshipOptions.length > 0 &&
      storedSchemaVersion !== OUTPUT_MARKDOWN_SCHEMA_VERSION;

    if (shouldForceDefaults) {
      applyOutputMarkdownDefaults();
    } else {
      const storedSchemasRaw = localStorage.getItem('selectedSchemas');
      let shouldApplySchemaDefaults = false;

      if (storedSchemasRaw) {
        try {
          const parsedSchemas = JSON.parse(storedSchemasRaw);
          if (
            parsedSchemas?.db === userCredentials.uri &&
            Array.isArray(parsedSchemas.selectedOptions) &&
            parsedSchemas.selectedOptions.length > 0
          ) {
            setSelectedSchemas(parsedSchemas.selectedOptions);
          } else {
            shouldApplySchemaDefaults = true;
          }
        } catch (error) {
          console.error('Failed to parse stored schemas from localStorage', error);
          shouldApplySchemaDefaults = true;
        }
      } else if (defaultSchemaSelection.length) {
        shouldApplySchemaDefaults = true;
      }

      if (shouldApplySchemaDefaults) {
        applyOutputMarkdownDefaults();
      } else {
        const storedNodeLabels = localStorage.getItem('selectedNodeLabels');
        if (storedNodeLabels) {
          try {
            const parsedNodeLabels = JSON.parse(storedNodeLabels);
            if (
              parsedNodeLabels?.db === userCredentials.uri &&
              Array.isArray(parsedNodeLabels.selectedOptions) &&
              parsedNodeLabels.selectedOptions.length > 0
            ) {
              setSelectedNodes(parsedNodeLabels.selectedOptions);
            } else {
              applyDefaultNodes();
            }
          } catch (error) {
            console.error('Failed to parse stored node labels from localStorage', error);
            applyDefaultNodes();
          }
        } else {
          applyDefaultNodes();
        }

        const storedRelationshipLabels = localStorage.getItem('selectedRelationshipLabels');
        if (storedRelationshipLabels) {
          try {
            const parsedRelationshipLabels = JSON.parse(storedRelationshipLabels);
            if (
              parsedRelationshipLabels?.db === userCredentials.uri &&
              Array.isArray(parsedRelationshipLabels.selectedOptions) &&
              parsedRelationshipLabels.selectedOptions.length > 0
            ) {
              const rels = parsedRelationshipLabels.selectedOptions;
              setSelectedRels(rels);
              const generatedPatterns = rels.map((rel: { value: string }) => {
                const [source, type, target] = rel.value.split(',');
                return `(${source})-[${type}]->(${target})`;
              });
              setAllPatterns(generatedPatterns);
            } else {
              applyDefaultRelationships();
            }
          } catch (error) {
            console.error('Failed to parse stored relationship labels from localStorage', error);
            applyDefaultRelationships();
          }
        } else {
          applyDefaultRelationships();
        }
      }
    }

    if (defaultsApplied) {
      localStorage.setItem(OUTPUT_MARKDOWN_SCHEMA_VERSION_KEY, OUTPUT_MARKDOWN_SCHEMA_VERSION);
    }

    if (selectedTokenChunkSizeStr != null) {
      const parsedSelectedChunk_size = JSON.parse(selectedTokenChunkSizeStr);
      setSelectedTokenChunkSize(parsedSelectedChunk_size.selectedOption);
    }
    if (selectedChunk_overlapStr != null) {
      const parsedSelectedChunk_overlap = JSON.parse(selectedChunk_overlapStr);
      setSelectedChunk_overlap(parsedSelectedChunk_overlap.selectedOption);
    }
    if (selectedChunks_to_combineStr != null) {
      const parsedSelectedChunks_to_combine = JSON.parse(selectedChunks_to_combineStr);
      setSelectedChunk_overlap(parsedSelectedChunks_to_combine.selectedOption);
    }
    if (selectedInstructstr != null) {
      const selectedInstructions = selectedInstructstr;
      setAdditionalInstructions(selectedInstructions);
    }
  }, [
    userCredentials,
    outputMarkdownNodeOptions,
    outputMarkdownRelationshipOptions,
    outputMarkdownSelectedSchemaOptions,
    selectedTokenChunkSizeStr,
    selectedChunk_overlapStr,
    selectedChunks_to_combineStr,
    selectedInstructstr,
  ]);

  const value: FileContextType = {
    files,
    filesData,
    setFiles,
    setFilesData,
    model,
    setModel,
    graphType,
    setGraphType,
    selectedRels,
    setSelectedRels,
    selectedNodes,
    setSelectedNodes,
    selectedTokenChunkSize,
    setSelectedTokenChunkSize,
    selectedChunk_overlap,
    setSelectedChunk_overlap,
    selectedChunks_to_combine,
    setSelectedChunks_to_combine,
    rowSelection,
    setRowSelection,
    selectedRows,
    setSelectedRows,
    selectedSchemas,
    setSelectedSchemas,
    chatModes,
    setchatModes,
    setShowTextFromSchemaDialog,
    showTextFromSchemaDialog,
    postProcessingTasks,
    setPostProcessingTasks,
    queue,
    setQueue,
    processedCount,
    setProcessedCount,
    postProcessingVal,
    setPostProcessingVal,
    additionalInstructions,
    setAdditionalInstructions,
    schemaTextPattern,
    setSchemaTextPattern,
    allPatterns,
    setAllPatterns,
    schemaValRels,
    setSchemaValRels,
    schemaValNodes,
    setSchemaValNodes,
    schemaLoadDialog,
    setSchemaLoadDialog,
    dbNodes,
    setDbNodes,
    dbRels,
    setDbRels,
    dbPattern,
    setDbPattern,
    predefinedSchemaDialog,
    setPredefinedSchemaDialog,
    preDefinedNodes,
    setPreDefinedNodes,
    preDefinedRels,
    setPreDefinedRels,
    preDefinedPattern,
    setPreDefinedPattern,
    userDefinedNodes,
    setUserDefinedNodes,
    userDefinedRels,
    setUserDefinedRels,
    userDefinedPattern,
    setUserDefinedPattern,
    selectedPreDefOption,
    setSelectedPreDefOption,
    sourceOptions,
    setSourceOptions,
    typeOptions,
    setTypeOptions,
    targetOptions,
    setTargetOptions,
    dataImporterSchemaDialog,
    setDataImporterSchemaDialog,
    importerNodes,
    setImporterNodes,
    importerRels,
    setImporterRels,
    importerPattern,
    setImporterPattern,
  };
  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};
const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileContextProvider');
  }
  return context;
};
export { FileContextProvider, useFileContext };
