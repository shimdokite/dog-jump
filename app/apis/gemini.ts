import axios from "axios";

export const gemini = async (content: string) => {
    try {
        const result = await axios.post('/api/gemini', { content: content }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if(result.status === 404 || result.status === 500) return '';

        return result.data;
    } catch (error) {
        console.log(error);
        
        return error;
    }
}