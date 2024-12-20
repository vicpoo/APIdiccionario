import { ResultSetHeader } from 'mysql2';
import connection from '../../shared/config/database';
import { Diccionary } from '../models/Diccionary';

export class DiccionaryRepository {
    public static async findAll(): Promise<Diccionary[]> {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT word_id, word, definition, created_at, updated_at, deleted FROM words WHERE deleted = 0',
                (error, results) => {
                    if (error) {
                        console.error("Error fetching words:", error);
                        reject(error);
                    } else {
                        resolve(results as Diccionary[]);
                    }
                }
            );
        });
    }

    // Busca la palabra con coincidencia exacta
    public static async findByWordOrInitial(searchTerm: string): Promise<Diccionary[]> {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT word_id, word, definition, created_at, updated_at, deleted FROM words WHERE word = ? AND deleted = 0',
                [searchTerm], // Usa coincidencia exacta
                (error, results) => {
                    if (error) {
                        console.error("Error fetching word:", error);
                        reject(error);
                    } else {
                        resolve(results as Diccionary[]);
                    }
                }
            );
        });
    }

    public static async createWord(diccionary: Diccionary): Promise<Diccionary> {
        const query = 'INSERT INTO words (word, definition, created_at, updated_at, deleted) VALUES (?, ?, NOW(), NOW(), 0)';
        const { word, definition } = diccionary;
    
        // Validación previa para evitar valores undefined
        if (!word || !definition) {
            throw new Error("Both 'word' and 'definition' fields are required and must be defined.");
        }
    
        return new Promise((resolve, reject) => {
            connection.execute(query, [word, definition], (error, result: ResultSetHeader) => {
                if (error) {
                    console.error("Error inserting word:", error);
                    reject(error);
                } else {
                    resolve({ ...diccionary, word_id: result.insertId });
                }
            });
        });
    }
    
    public static async updateWord(word_id: number, wordData: Partial<Diccionary>): Promise<boolean> {
        const query = 'UPDATE words SET word = ?, definition = ?, updated_at = NOW() WHERE word_id = ? AND deleted = 0';
        return new Promise((resolve, reject) => {
            connection.execute(query, [wordData.word, wordData.definition, word_id], (error) => {
                if (error) {
                    console.error("Error updating word:", error);
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }

    public static async deleteWord(word_id: number): Promise<boolean> {
        const query = 'UPDATE words SET deleted = 1 WHERE word_id = ?';
        return new Promise((resolve, reject) => {
            connection.execute(query, [word_id], (error) => {
                if (error) {
                    console.error("Error deleting word:", error);
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }


    
    public static async findByInitialLetter(letter: string): Promise<Diccionary[]> {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT word_id, word, definition, created_at, updated_at, deleted FROM words WHERE word LIKE ? AND deleted = 0',
                [`${letter}%`], // Filtra palabras que inician con la letra
                (error, results) => {
                    if (error) {
                        console.error("Error fetching words by initial letter:", error);
                        reject(error);
                    } else {
                        resolve(results as Diccionary[]);
                    }
                }
            );
        });
    }
    

}
