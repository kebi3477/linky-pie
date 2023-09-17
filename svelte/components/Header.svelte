<script>
    import { navigate } from "svelte-routing/src/history";
    import logo from '../public/images/logo_b.svg';

    function redirect(url) {
        navigate(`/${url}`, { replace: true });
    }

    async function logout() {
        try {
            const res = await fetch('/api/auth/logout')
            if (res.status === 200) {
                redirect('');
            } else {
                alert('로그아웃 실패!');
            }
        } catch (err) {
            alert('로그아웃 실패!');
            console.log(err);
        }
    }
</script>


<div class="header">
    <button on:click={() => redirect('my-page')}>
        <img src="{logo}" alt="logo">
    </button>

    <button on:click={logout}>로그아웃</button>
</div>

<style>
    .header {
        width: 100%;
        height: 76px;
        background-color: #fff;
        padding: 23px 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .header > button {
        font-family: 'Ramche', sans-serif;
    }
    
</style>