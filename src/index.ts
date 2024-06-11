import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { convertImage } from './imageConverter';
import { convertVideo } from './videoConverter';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const inputDir = path.join(__dirname, '../arquivos');
const outputDir = path.join(inputDir, 'convertidos');

const ensureDirectoriesExist = () => {
    if (!fs.existsSync(inputDir)) {
        fs.mkdirSync(inputDir);
    }
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
};

const listFiles = (dirPath: string, extension: string): string[] => {
    const files = fs.readdirSync(dirPath);
    return files.filter(file => path.extname(file).toLowerCase() === `.${extension}`);
};

const checkAlreadyConverted = (files: string[], extension: string): string[] => {
    const convertedFiles = listFiles(outputDir, extension);
    return files.filter(file => !convertedFiles.includes(`${path.parse(file).name}.${extension}`));
};

const showMenu = async () => {
    console.log('\nEscolha uma opção:');
    console.log('1. Converter Imagem para PNG');
    console.log('2. Converter Imagem para JPG');
    console.log('3. Converter Vídeo para MP3');
    console.log('4. Sair');
    const option = await askQuestion('Opção: ');
    await handleMenuOption(option);
};

const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

const handleMenuOption = async (option: string) => {
    switch (option) {
        case '1':
            const jpgFiles = listFiles(inputDir, 'jpg');
            if (jpgFiles.length === 0) {
                console.log('Nenhum arquivo JPG encontrado na pasta "arquivos".');
            } else {
                const notConvertedFiles = checkAlreadyConverted(jpgFiles, 'png');
                if (notConvertedFiles.length === 0) {
                    console.log('Todos os arquivos JPG já foram convertidos para PNG.');
                } else {
                    console.log('Arquivos disponíveis:');
                    notConvertedFiles.forEach(file => console.log(file));
                    let answer = await askQuestion('Você quer converter esses arquivos? (s/n) ');
                    while (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'n') {
                        console.log('Resposta inválida! Por favor, digite "s" para sim ou "n" para não.');
                        answer = await askQuestion('Você quer converter esses arquivos? (s/n) ');
                    }
                    if (answer.toLowerCase() === 's') {
                        console.log('Convertendo...');
                        await Promise.all(notConvertedFiles.map(file => convertImage(file, 'png')));
                    }
                }
            }
            break;
        case '2':
            const pngFiles = listFiles(inputDir, 'png');
            if (pngFiles.length === 0) {
                console.log('Nenhum arquivo PNG encontrado na pasta "arquivos".');
            } else {
                const notConvertedFiles = checkAlreadyConverted(pngFiles, 'jpg');
                if (notConvertedFiles.length === 0) {
                    console.log('Todos os arquivos PNG já foram convertidos para JPG.');
                } else {
                    console.log('Arquivos disponíveis:');
                    notConvertedFiles.forEach(file => console.log(file));
                    let answer = await askQuestion('Você quer converter esses arquivos? (s/n) ');
                    while (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'n') {
                        console.log('Resposta inválida! Por favor, digite "s" para sim ou "n" para não.');
                        answer = await askQuestion('Você quer converter esses arquivos? (s/n) ');
                    }
                    if (answer.toLowerCase() === 's') {
                        console.log('Convertendo...');
                        await Promise.all(notConvertedFiles.map(file => convertImage(file, 'jpg')));
                    }
                }
            }
            break;
        case '3':
            const mp4Files = listFiles(inputDir, 'mp4');
            if (mp4Files.length === 0) {
                console.log('Nenhum arquivo MP4 encontrado na pasta "arquivos".');
            } else {
                const notConvertedFiles = checkAlreadyConverted(mp4Files, 'mp3');
                if (notConvertedFiles.length === 0) {
                    console.log('Todos os arquivos MP4 já foram convertidos para MP3.');
                } else {
                    console.log('Arquivos disponíveis:');
                    notConvertedFiles.forEach(file => console.log(file));
                    let answer = await askQuestion('Você quer converter esses arquivos? (s/n) ');
                    while (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'n') {
                        console.log('Resposta inválida! Por favor, digite "s" para sim ou "n" para não.');
                        answer = await askQuestion('Você quer converter esses arquivos? (s/n) ');
                    }
                    if (answer.toLowerCase() === 's') {
                        console.log('Convertendo...');
                        await Promise.all(notConvertedFiles.map(file => convertVideo(file, 'mp3')));
                    }
                }
            }
            break;
        case '4':
            rl.close();
            break;
        default:
            console.log('Opção inválida! Por favor, escolha uma das opções listadas.');
            break;
    }
    if (option !== '4') {
        await showMenu();
    }
};

console.log('Bem-vindo ao conversor de arquivos!');
ensureDirectoriesExist();
showMenu();
