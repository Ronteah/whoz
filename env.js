import { writeFileSync } from 'fs';

const apiUrl = process.env.API_URL || 'http://localhost:3000';

const environmentFileContent = `
export const environment = {
    API_URL: '${apiUrl}'
};
`;

writeFileSync('./src/environments/environment.vercel.ts', environmentFileContent);