import { pool } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { phoneNumber, descriptor } = req.body;

    try {
        // Начинаем транзакцию
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Получаем или создаем пользователя
            const userResult = await client.query(
                `INSERT INTO users (phone_number) 
                 VALUES ($1)
                 ON CONFLICT (phone_number) DO UPDATE 
                 SET phone_number = EXCLUDED.phone_number
                 RETURNING id`,
                [phoneNumber]
            );

            const userId = userResult.rows[0].id;

            // Деактивируем старые дескрипторы
            await client.query(
                `UPDATE face_descriptors 
                 SET is_active = false 
                 WHERE user_id = $1`,
                [userId]
            );

            // Добавляем новый дескриптор
            await client.query(
                `INSERT INTO face_descriptors (user_id, descriptor)
                 VALUES ($1, $2)`,
                [userId, descriptor]
            );

            await client.query('COMMIT');
            res.status(200).json({ success: true });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error registering face:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 