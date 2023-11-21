//gestimumController
import { Request, Response } from 'express';

const gestimumController = {
    index: (req: Request, res: Response) => {
        console.log('Hello, Gestimum!'.magenta.bold)
        return res.send('Hello, Gestimum!');
    }
}

export default gestimumController;