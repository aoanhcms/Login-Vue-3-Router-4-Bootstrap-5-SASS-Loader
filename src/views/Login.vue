<template>
    <div class="login" style="padding: 10px">
        <form @submit.prevent="login" class="formLogin">
            
            <p class="notification">
                Nhận Ngay Voucher 10% khi tạo tài khoản để chat
            </p>
            <div class="form-outline">
                <input type="email" placeholder="Họ và Tên" class="form-control input" v-model="form.email" required
                    autofocus />
            </div>
            <div class="form-outline">
                <input type="email" placeholder="Tên đăng nhập" class="form-control input" v-model="form.email" required
                    autofocus />
            </div>
                
            <div class="form-outline">
                <input type="email" placeholder="Phòng Ban" class="form-control input" v-model="form.email" required
                    autofocus />
            </div>
           
            <button type="submit" class="form-control btn">
                Chat
            </button>
            <button type="submit" class="form-control btn">
                Chat bằng tài khoản Facebook
            </button>
            <button type="submit" class="form-control btn">
                Chat bằng tài khoản Google
            </button>
        </form>
        <!-- channel -->
        <!-- <div class="channel_block">
            <div class="channel_block_inner">
                <p class="block-title">Liên hệ qua kênh yêu thích của bạn</p>
                <div class="channel-items">
                    <div class="channel-item"><a target="_blank" href="https://zalo.me/3485145501063282921"><img
                                src="https://cdn.fchat.vn/assets/images/social/zalo.png">Zalo</a></div>
                    <div class="channel-item"><a target="_blank" href="https://m.me/fchat.software/"><img
                                src="https://cdn.fchat.vn/assets/images/social/message.png">Messenger</a></div>
                    <div class="channel-item"><a href="tel:0898986008"><img
                                src="https://cdn.fchat.vn/assets/images/social/phone.png">Hotline</a></div>
                    <div class="channel-item"><a href="mailto:cskh@salemall.vn"><img
                                src="https://cdn.fchat.vn/assets/images/social/email.png">Email</a></div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>  -->

    </div>
</template>

<script>
    import Swal from 'sweetalert2';
    import queryStr from '../libs/queryStr'
    export default {
        name: 'LoginComponent',
        data() {
            return {
                form: {
                    email: "",
                    password: "",
                    with_room_id: true,
                    page_id: "",
                },
                error: "",
                data: [],
            }
        },
        created() {
            console.log('thí.props', queryStr(this.$route.query.redirect));

        },
        mounted() {

        },
        methods: {
            login() {
                this.form.page_id = queryStr(this.$route.query.redirect).page_id
                this.axios.post('/auth/login', this.form)
                    .then((res) => {
                        if (res.accessToken) {
                            this.$root.$emit("login", true);
                            localStorage.setItem('accessToken', res.accessToken);
                            localStorage.setItem('roomId', res.roomId);
                            localStorage.setItem('userData', JSON.stringify(res.userData));
                            this.$router.push(this.$route.query.redirect);
                        } else {
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