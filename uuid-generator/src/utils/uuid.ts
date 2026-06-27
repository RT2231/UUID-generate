import { v1, v3, v4, v5, v7 } from 'uuid';

function v6(): string {
  const uuidv1 = v1();
  const parts = uuidv1.split('-');
  const timeHi = parts[2];
  const timeMid = parts[1];
  const timeLow = parts[0];
  
  const newPart0 = timeHi.slice(0, 4);
  const newPart1 = timeMid;
  const newPart2 = timeLow.slice(0, 4);
  const newPart3 = parts[3];
  const newPart4 = parts[4];
  
  return `${newPart0}-${newPart1}-${newPart2}-${newPart3}-${newPart4}`;
}

function v8(customData?: string): string {
  if (customData && customData.length === 32) {
    const hex = customData.toLowerCase();
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-8${hex.slice(13, 15)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }
  
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x80;
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;
  
  const hex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export interface UUIDGenerationOptions {
  version: number;
  count: number;
  namespace?: string;
  name?: string;
  customData?: string;
}

export function generateUUIDs(options: UUIDGenerationOptions): string[] {
  const { version, count, namespace, name, customData } = options;
  const uuids: string[] = [];
  
  for (let i = 0; i < count; i++) {
    let uuid: string;
    
    switch (version) {
      case 1:
        uuid = v1();
        break;
      case 3:
        if (!namespace || !name) {
          throw new Error('Namespace and Name are required for UUID v3');
        }
        uuid = v3(name, namespace as any);
        break;
      case 4:
        uuid = v4();
        break;
      case 5:
        if (!namespace || !name) {
          throw new Error('Namespace and Name are required for UUID v5');
        }
        uuid = v5(name, namespace as any);
        break;
      case 6:
        uuid = v6();
        break;
      case 7:
        uuid = v7();
        break;
      case 8:
        uuid = v8(customData);
        break;
      default:
        throw new Error(`Unsupported UUID version: ${version}`);
    }
    
    uuids.push(uuid);
  }
  
  return uuids;
}

export function formatUUID(uuid: string, format: string): string {
  const clean = uuid.replace(/-/g, '');
  
  switch (format) {
    case 'normal':
      return uuid;
    case 'no-hyphen':
      return clean;
    case 'uppercase':
      return uuid.toUpperCase();
    case 'lowercase':
      return uuid.toLowerCase();
    default:
      return uuid;
  }
}

export function getOutputFormat(uuids: string[], format: string, outputType: string): string {
  const formatted = uuids.map(u => formatUUID(u, format));
  
  switch (outputType) {
    case 'json':
      return JSON.stringify(formatted, null, 2);
    case 'csv':
      return formatted.join(',');
    case 'newline':
      return formatted.join('\n');
    default:
      return formatted.join('\n');
  }
}

export function validateUUID(uuid: string): { valid: boolean; version?: number; variant?: string } {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(uuid)) {
    return { valid: false };
  }
  
  const version = parseInt(uuid[14], 10);
  const variantBits = parseInt(uuid[19], 16);
  
  let variant: string;
  if ((variantBits & 0x8) === 0) {
    variant = 'Reserved (NCS backward compatibility)';
  } else if ((variantBits & 0x4) === 0) {
    variant = 'RFC 4122';
  } else if ((variantBits & 0x2) === 0) {
    variant = 'Reserved (Microsoft backward compatibility)';
  } else {
    variant = 'Reserved (future use)';
  }
  
  return { valid: true, version, variant };
}

export const NAMESPACE_PRESETS = [
  { name: 'DNS', value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' },
  { name: 'URL', value: '6ba7b811-9dad-11d1-80b4-00c04fd430c8' },
  { name: 'OID', value: '6ba7b812-9dad-11d1-80b4-00c04fd430c8' },
  { name: 'X.500 DN', value: '6ba7b814-9dad-11d1-80b4-00c04fd430c8' },
];
