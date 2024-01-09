import * as fs from 'fs/promises';
import * as path from 'path';

export async function readDataFile(fileName) {
    try {
        const filePath = path.join(__dirname, fileName);
        const configFile = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(configFile);
      } catch (error) {
        console.error('Error reading config file:', error);
        throw error;
      }
}
