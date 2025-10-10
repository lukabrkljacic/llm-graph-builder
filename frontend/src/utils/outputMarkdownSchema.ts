import schemaExamples from '../assets/newSchema.json';
import { OptionType } from '../types';

const OUTPUT_MARKDOWN_SCHEMA_KEY = 'output_markdown';
export const OUTPUT_MARKDOWN_SCHEMA_DISPLAY_NAME = 'Output Markdown (99P Projects)';
export const OUTPUT_MARKDOWN_SCHEMA_VERSION = '1';
export const OUTPUT_MARKDOWN_SCHEMA_VERSION_KEY = 'outputMarkdownSchemaVersion';

type SchemaExample = {
  schema: string;
  triplet: string[];
};

type ParsedTriplet = {
  source: string;
  relationship: string;
  target: string;
};

const outputMarkdownSchema = (schemaExamples as SchemaExample[]).find(
  (example) => example.schema === OUTPUT_MARKDOWN_SCHEMA_KEY
);

const parseTriplet = (triplet: string): ParsedTriplet | null => {
  if (!triplet) {
    return null;
  }
  const [sourcePart, targetPart] = triplet.split('->');
  if (!sourcePart || !targetPart) {
    return null;
  }
  const [rawSource, rawRelationship] = sourcePart.split('-');
  if (!rawSource || !rawRelationship) {
    return null;
  }
  const source = rawSource.trim();
  const relationship = rawRelationship.trim();
  const target = targetPart.trim();
  if (!source || !relationship || !target) {
    return null;
  }
  return { source, relationship, target };
};

const parsedTriplets = (outputMarkdownSchema?.triplet ?? []).map(parseTriplet).filter((item): item is ParsedTriplet => !!item);

const nodeLabels = parsedTriplets.reduce<Set<string>>((labels, triplet) => {
  labels.add(triplet.source);
  labels.add(triplet.target);
  return labels;
}, new Set<string>());

const nodeOptions = Array.from(nodeLabels).map<OptionType>((label) => ({
  label,
  value: label,
}));

const relationshipMap = parsedTriplets.reduce<Map<string, OptionType>>((map, { source, relationship, target }) => {
  const value = `${source},${relationship},${target}`;
  if (!map.has(value)) {
    map.set(value, {
      label: `${source} -[:${relationship}]-> ${target}`,
      value,
    });
  }
  return map;
}, new Map<string, OptionType>());

const relationshipOptions = Array.from(relationshipMap.values());

const patternStrings = relationshipOptions.map((option) => option.label);

const schemaOption: OptionType | null = outputMarkdownSchema
  ? {
      label: OUTPUT_MARKDOWN_SCHEMA_DISPLAY_NAME,
      value: JSON.stringify(outputMarkdownSchema.triplet),
    }
  : null;

const schemaSelection = schemaOption ? [schemaOption] : [];

export const outputMarkdownSchemaTriplets: readonly string[] = Object.freeze([
  ...(outputMarkdownSchema?.triplet ?? []),
]);

export const outputMarkdownNodeOptions: readonly OptionType[] = Object.freeze([...nodeOptions]);

export const outputMarkdownRelationshipOptions: readonly OptionType[] = Object.freeze([
  ...relationshipOptions,
]);

export const outputMarkdownPatterns: readonly string[] = Object.freeze([...patternStrings]);

export const outputMarkdownSchemaOption: OptionType | null = schemaOption;

export const outputMarkdownSelectedSchemaOptions: readonly OptionType[] = Object.freeze([
  ...schemaSelection,
]);

export const hasOutputMarkdownSchema = schemaOption !== null;

export const OUTPUT_MARKDOWN_SCHEMA_NAME = outputMarkdownSchema?.schema ?? OUTPUT_MARKDOWN_SCHEMA_KEY;
