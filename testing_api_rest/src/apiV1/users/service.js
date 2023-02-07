/* =================================== MODULES =================================== */
import UsersDAOFactory from "./classes/DAOFactory.class.js";
import CustomError from '../../classes/CustomError.class.js';
import bcrypt from 'bcrypt';
import logger from '../../utils/logger.js';
import { unlink } from 'node:fs';
/* ================================== INSTANCES ================================== */
const DAO = UsersDAOFactory.get();
/* ================================== SERVICES  ================================== */
class userService {
    register = async (user, file, filePath) => {
        try {
            const userExist = await DAO.searchUser(user.username);
            if (userExist === null) {
                const {name, username, age, password, phone, address} = user;
                const newUser = {
                    name,
                    password: await bcrypt.hash(password, 10),
                    username,
                    age,
                    address,
                    phone,
                    userImg: file
                };
                const newUserId = await DAO.add(newUser);
                logger.info(`message: 'User with ID '${newUserId}' registered!!!'`);
                
                return newUserId;
            } else {
                unlink(`${filePath}`, (err) => {
                    if (err){
                        // throw new CustomError({customCode:500,customName:'unlink() error',message:err.message});
                    }
                    logger.info(`message: 'File '${file}' was deleted'`);
                });
                throw new CustomError({customCode:409,customName:'u11serService: register()',customMsg:'User exists'})
            }
        } catch (error) {
            throw new CustomError(error);
        }
    }

    getUser = async (userId) => {
        try {
            const user = await DAO.getById(userId);
            logger.info(`message: 'User with ID '${userId}' found!!'`);
            return user
        } catch (error) {
            throw new CustomError(error);
        }
    }

    updateUser = async (userId, obj) => {
        try {
            if (obj.password !== undefined) {
                obj.password = await bcrypt.hash(obj.password, 10);
            }
            if (obj.userImg !== undefined) {
                const regex = /\s/gi;
                obj.userImg = obj.userImg.replace(regex, '%');
            }
            await DAO.update(userId, obj);
            logger.info(`message: '${userId} updated!!!'`);
        } catch (error) {
            throw new CustomError(error);
        }
    }

    deleteUser = async (userId) => {
        try {
            const user = await DAO.getById(userId);
            await DAO.deleteById(userId);
            unlink(`public/images/user/${user.userImg}`, ( ) => {
                logger.info(`message: 'File '${user.userImg}' was deleted'`);
            });

            logger.info(`message: '${userId} deleted!!!'`);
        } catch (error) {
            throw new CustomError(error);
        }
    }

    getAllUsers = async () => {
        try {
            const users = await DAO.getAll();
            logger.info(`message: 'Quantity of users: ${users.length}'`);
            return users;
        } catch (error) {
            throw new CustomError(error);
        }
    }

    deleteAllUsers = async () => {
        try {
            await DAO.deleteAll();
            logger.info(`message: 'All users deleted!!!'`);
        } catch (error) {
            throw new CustomError(error);
        }
    }
}
/* =============================== EXPORTED MODULES ============================== */
export default userService;