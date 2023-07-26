<script>
    import Fetch from '../Module/fetch';
    import Header from './Header.svelte';

    let id = '';
    let password = '';

    async function login() {
        try {
            const res = await Fetch.post('/api/users/login', { id, password })
            alert('로그인 성공!');
            location.href = '/';
        } catch (err) {
            alert(err.message);
        }
    }

</script>
<main>
    <Header></Header>
    <div class="login__content">
        <div class="login__wraper">
            <div class="login__title title">Welcome! Friend!</div>
            <div class="login__title--small title">I'm Web Collector</div>
            <input type="text" name="id" id="login__input-id" class="login__input-id input" placeholder="ID" bind:value={id}>
            <input type="password" name="pw" id="login__input-pw" class="login__input-pw input" placeholder="PASSWORD" bind:value={password}>
            <button class="login__button" on:click={login}>LOGIN</button>
        </div>
    </div>
</main>
<style>
    main {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        background-color: #102031;
    }
    .login__content {
        width: 500px;
        height: 90vh;
        background-color: #ffffff1f;
        display: grid;
        align-items: center;
        justify-content: center;
    }
    .login__wraper {
        width: 300px;
        display: flex;
        flex-flow: column nowrap;
        margin-top: -200px;
        gap: 10px;
    }
    .title {
        width: 100%;
        text-align: center;
        color: #fff;
    }
    .login__title {
        font-size: 16pt;
        font-weight: bold;
    }
    .login__title--small {
        font-size: 10pt;
        margin-bottom: 50px;
    }
    .input {
        color: #fff;
        background-color: #ffffff1f;
        font-size: 14pt;
    }
    .login__button {
        padding: 10px;
        cursor: pointer;
        font-size: 12pt;
        font-weight: bold;
        color: #fff;
        transition: .5s;
        background-color: #001a35;
    }
    .login__button:hover {
        background-color: #06223f;
    }
</style>