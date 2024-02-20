
function Input() {

    async function postToken(data) {
        try {
            const response = await fetch("http://localhost:4173/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/text',
                    Token: data
                }
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        const inputData = e.target[0].value;

        postToken(inputData);
    }

    return(
        <>
            <form action="submit"onSubmit={handleSubmit}>
                <h3>Put your token here</h3>
                <input type="text"/>
                <button type="submit">Send</button>
            </form>
        </>
    )
}

export default Input;