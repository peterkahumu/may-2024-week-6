document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const fullname = formData.get('full_name');
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        try{
            const response = await fetch('api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(fullname, username, email, password)
            }); // wait for the fetch method to be triggered

            // check if the response was successful or not.
            if (response.ok){
                alert("Registration was successfull.");
            } else {
                alert("Registration Failed.");
            }
        } catch(error) {
            console.log(error);
        }


    });
});