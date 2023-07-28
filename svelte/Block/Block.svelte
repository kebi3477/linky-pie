<script>
    import { navigate } from "svelte-routing";
    import Fetch from "../Module/fetch";

    let url = '';


    async function loginCheck() {
        const res = await Fetch.get('/api/users');

        if (res.statusCode === 401) {
            alert('로그인이 필요합니다!');
            navigate('/', { replace: true });
        }
    }

    async function handleEnter(event) {
        if(event.key !== 'Enter') {
            return;
        }

        createBlock();
    }

    async function handlePaste(event) {
        url = (event.clipboardData || window.clipboardData).getData('text');

        createBlock();
    }

    async function createBlock(e) {
        
        //TODO : Create Block Event
        console.log(url);
    }

    loginCheck();
</script>

<main>
    <div class="url__container">
        <input type="text" name="url" id="url__input" class="url__input" bind:value={url} on:keydown={handleEnter} on:paste={handlePaste}>
    </div>
    <div class="block__list">
        <div class="block__item"></div>
    </div>
</main>

<style>
    
</style>