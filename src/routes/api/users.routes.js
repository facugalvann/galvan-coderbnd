import Router from 'express';
import userModel from '../../models/users.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const users = await userModel.find()
        console.log(users)
        res.send({
            status: 'success',
            data: users
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'error',
            message: 'An error occurred while fetching users.'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        const result = await userModel.create({
            first_name,
            last_name,
            email
        });
        res.send({
            status: 'success',
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'error',
            message: 'An error occurred while creating the user.'
        });
    }
});

router.get('/uid/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await userModel.findById({_id: uid});
        if (!user) {
            return res.status(404).send({
                status: 'error',
                message: 'User not found.'
            });
        }
        res.send({
            status: 'success',
            data: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'error',
            message: 'An error occurred while fetching the user.'
        });
    }
});
router.put('/:uid', async (req,res)=>{
    try {
        res.send('update user')
    } catch (error) {
        
    }
    
})
router.delete('/:uid', async (req,res)=>{
    try {
        res.send('delete user')
    } catch (error) {
        
    }
})
export default router;
