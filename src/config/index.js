import mongoose from "mongoose";
export const connectDb = async () => {
    try {
        // Intentando conectar a MongoDB Atlas
        await mongoose.connect('mongodb+srv://galvanfacundo004:Facugoten05@codercluster.dx1rh.mongodb.net/c82641?retryWrites=true&w=majority&appName=CoderCluster');
        
        console.log('Base de datos conectada con éxito');  // Mensaje de éxito
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);  // Mensaje de error más detallado
    }
};
