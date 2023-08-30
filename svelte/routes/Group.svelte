<script>
    import { onMount } from 'svelte';
    import Loading from '../components/Loading.svelte';
    import Fetch from '../utils/fetch';

    let loading;
    let title;
    let groups = [];

    async function handleEnter(event) {
        if(event.key !== 'Enter') {
            return;
        }

        createGroup(title);
    }

    async function handlePaste(event) {
        const title = (event.clipboardData || window.clipboardData).getData('text');

        createGroup(title);
    }

    async function createGroup(title) {
        loading.start();
        const res = await Fetch.post('/api/groups', {
            title: title,
            type: 0
        })

        if (res.statusCode === 201) {
            title = '';   
            groups = [...groups, res.group];
            console.log(groups);
        }

        loading.stop();
    }

    async function getGroupList() {
        loading.start();
        const res = await Fetch.get('/api/groups');
        groups = res.group;
        loading.stop();
    }

    onMount(getGroupList);
</script>
<main>
    <Loading bind:this={loading}></Loading>
    <div class="group__content">
        <div class="group__container">
            <input type="text" name="group" id="group__input" class="group__input" bind:value={title} on:keydown={handleEnter} on:paste={handlePaste}>
        </div>
        <div class="group__list">
            {#each groups as item, idx}
                <div class="group__item">
                    <div>{idx}</div>
                    <div>{item.title}</div>
                </div>
            {/each}
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
    .group__container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
    }
    .group__input {
        width: 80%;
    }
    .group__content {
        width: 500px;
        height: 90vh;
        background-color: #ffffff1f;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: start;
    }
    .group__list {
        width: 100%;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }
    .group__item {
        width: 80%;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .group__item > * {
        color: #fff;
    }
</style>