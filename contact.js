
        function validateEmail(email) {
            var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function handleSubmit(event) {
            event.preventDefault();
            
            var name = document.getElementById('name');
            var email = document.getElementById('email');
            var message = document.getElementById('message');
            
            var isValid = true;
            
            var nameGroup = name.parentElement;
            if (name.value.trim() === '') {
                nameGroup.classList.add('error');
                isValid = false;
            } else {
                nameGroup.classList.remove('error');
            }
            
            var emailGroup = email.parentElement;
            if (email.value.trim() === '' || !validateEmail(email.value)) {
                emailGroup.classList.add('error');
                isValid = false;
            } else {
                emailGroup.classList.remove('error');
            }
            
            var messageGroup = message.parentElement;
            if (message.value.trim() === '') {
                messageGroup.classList.add('error');
                isValid = false;
            } else {
                messageGroup.classList.remove('error');
            }
            
            if (isValid) {
                var confirmationMessage = document.getElementById('confirmationMessage');
                confirmationMessage.classList.add('show');
                
                name.value = '';
                email.value = '';
                message.value = '';
                
                setTimeout(function() {
                    confirmationMessage.classList.remove('show');
                }, 5000);
            }
        }

        document.getElementById('name').addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.parentElement.classList.remove('error');
            }
        });

        document.getElementById('email').addEventListener('input', function() {
            if (this.value.trim() !== '' && validateEmail(this.value)) {
                this.parentElement.classList.remove('error');
            }
        });

        document.getElementById('message').addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.parentElement.classList.remove('error');
            }
        });
