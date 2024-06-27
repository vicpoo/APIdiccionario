import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";
import { DateUtils } from "../../shared/utils/DateUtils";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET || "";


const saltRounds = 10;

export class userService {

    public static async login(name: string, password: string){
        try{
            const user = await this.getUserBylName(name);
            if(!user){
                return null;
            }
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return null;
            }

            const payload = {
                user_id: user.user_id,
                rol_id_pk: user.rol_id_fk,
                name: user.name
            }
            return await jwt.sign(payload, secretKey, { expiresIn: '5m' });

        }catch (error: any){
            throw new Error(`Error al logearse: ${error.message}`);
        }

    }

    public static async getAllUser(): Promise<User[]> {
        try{
            return await UserRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener empleados: ${error.message}`);
        }
    }

    public static async getUserById(userId: number): Promise<User | null> {
        try{
            return await UserRepository.findById(userId);
        }catch (error: any){
            throw new Error(`Error al encontrar empleado: ${error.message}`);
        }
    }

    public static async getUserBylName(name: string): Promise<User | null> {
        try{
            return await UserRepository.findByName(name);
        }catch (error: any){
            throw new Error(`Error al encontrar empleado: ${error.message}`);
        }
    }

    public static async addUser(user: User) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            user.created_at = DateUtils.formatDate(new Date());
            user.updated_at = DateUtils.formatDate(new Date());
            user.password = await bcrypt.hash(user.password, salt);
            return await UserRepository.createUser(user);
        } catch (error: any) {
            throw new Error(`Error al crear empleado: ${error.message}`);
        }
    }

    public static async modifyUser(userId: number, userData: User){
        try{
            const userFinded =  await UserRepository.findById(userId);
            const salt = await bcrypt.genSalt(saltRounds);

            if(userFinded){
                if(userData.name){
                    userFinded.name = userData.name;
                }
                if(userData.password){
                    userFinded.password = await bcrypt.hash(userData.password, salt);
                }
                if(userData.email){
                    userFinded.email = userData.email;
                }                
                if(userData.rol_id_fk){
                    userFinded.rol_id_fk = userData.rol_id_fk;
                }
                if(userData.deleted){
                    userFinded.deleted = userData.deleted;
                }
            }else{
                return null;
            }
            userFinded.updated_by = userData.updated_by
            userFinded.updated_at = DateUtils.formatDate(new Date());
            return await UserRepository.updateUser(userId, userFinded);
        }catch (error: any){
            throw new Error(`Error al modificar empleado: ${error.message}`);
        }
    }

    public static async deleteUser(userId: number): Promise<boolean> {
        try{
            return await UserRepository.deleteUser(userId);
        }catch (error: any){
            throw new Error(`Error al eliminar empleado: ${error.message}`);
        }
    }

}