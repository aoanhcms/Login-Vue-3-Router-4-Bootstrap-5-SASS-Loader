<template>
    <div class="login">
        <form @submit.prevent="login" class="formLogin">
            <!-- Email input -->
            <div class="notification">
              Chào mừng bạn đến với Osiner.com
            </div>
            <div class="form-outline">
                <input type="email"  placeholder="Tên đăng nhập" class="form-control"
                    v-model="form.email" required autofocus />
            </div>
            <!-- Password input -->
            <div class="form-outline">
                <input type="password" placeholder="Mật khẩu" class="form-control"
                    v-model="form.password" required />
            </div>
            <!-- Submit button -->
            <button type="submit" class="btn">Đăng nhập</button>
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
            form: {
                email: "",
                password: "",
            },
            error: "",
            data: [],
        }
    },
    methods: {
        login() {
          this.axios.post('/auth/login', this.form)
            .then((res) => {
                console.log('res', res);
                if(res.accessToken) {
                    this.$root.$emit("login", true);
                    localStorage.setItem('accessToken', res.accessToken);
                    localStorage.setItem('userData', JSON.stringify(res.userData));
                    this.$router.push({name: 'box', params: {page_id: 25}});
                }else {
                    Swal.fire({
                        title: 'OPPS',
                        text: 'Username password not found 1!',
                        icon: 'warning',
                    });
                }
            }).catch((e) => {
                console.log('error', e);
                Swal.fire({
                    title: 'OPPS',
                    text: 'Username password not found 2!',
                    icon: 'warning',
                });
            })
        },
    },
}
</script>