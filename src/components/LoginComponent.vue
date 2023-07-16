<template>
    <div class="" style="text-align: center">
        <form @submit.prevent="login">
            <!-- Email input -->
            <div class="form-outline mb-4">
                <input type="email" id="formLoginLabelEmail" class="form-control form-control-lg"
                    v-model="register.email" required autofocus />
            </div>

            <!-- Password input -->
            <div class="form-outline mb-4">
                <input type="password" id="formLoginLabelSenha" class="form-control form-control-lg"
                    v-model="register.password" required />
            </div>

            <div class="d-flex justify-content-around align-items-center mb-4">
                <!-- Checkbox -->
                <router-link to="/forget_password">Quên mật khẩu?</router-link>
                <router-link to="/register">Chưa có tài khoản</router-link>
            </div>
            <!-- Submit button -->
            <button type="submit" class="col-12 btn btn-primary btn-lg btn-block">Đăng nhập</button>
        </form>
    </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    name: 'LoginComponent',
    components: {
    },
    data() {
        return {
            register: {
                email: "",
                password: "",
            },
            error: "",
            data: [],
        }
    },
    methods: {
        login() {

            if (this.register.email == 'admin@gmail.com' && this.register.password == 'admin') {
                this.$root.$emit("login", true);
                localStorage.setItem("authOnly", true);
                localStorage.setItem('token', '123456789');

                Swal.fire({
                    title: 'Sucesso',
                    text: 'User Logged Success',
                    icon: 'success',
                }).then
                { this.$router.push({ path: '/pages/25/box-chat-widget' }); }

            } else {

                Swal.fire({
                    title: 'OPPS',
                    text: 'User = admin@gmail.com e Password = admin',
                    icon: 'warning',
                });
            }
        },
    },
}
</script>
