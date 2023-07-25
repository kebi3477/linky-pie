<script>
    import Header from './Header.svelte';
</script>
<main>
    <Header></Header>
    <div class="join__content">
        <div class="join__wraper">
            <div class="join__title title">Sign Up</div>
            <input type="text" name="id" id="join__input-id" class="join__input-id input" placeholder="ID">
            <input type="password" name="pw" id="join__input-pw" class="join__input-pw input" placeholder="PASSWORD">
            <input type="text" name="name" id="join__input-name" class="join__input-name input" placeholder="NAME">
            <button class="join__button">Join</button>
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
    .join__content {
        width: 500px;
        height: 100vh;
        background-color: #f2f2f2;
        display: grid;
        align-items: center;
        justify-content: center;
    }
    .join__wraper {
        width: 300px;
        display: flex;
        flex-flow: column nowrap;
        margin-top: -200px;
        gap: 30px;
    }
    .title {
        width: 100%;
        text-align: center;
        color: #102031;
    }
    .join__title {
        font-size: 16pt;
        font-weight: bold;
    }
    .input {
        color: #102031;
        background-color: #fbfbfb;
        font-size: 14pt;
    }
    .join__button {
        padding: 10px;
        cursor: pointer;
        font-size: 12pt;
        font-weight: bold;
        color: #fff;
        transition: .5s;
        background-color: #001a35;
    }
    .join__button:hover {
        background-color: #06223f;
    }
</style>    