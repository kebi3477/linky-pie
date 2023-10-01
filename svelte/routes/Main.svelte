<script>
    import { onMount } from 'svelte';

    import Header from "../components/Header.svelte";
    import Block from '../components/Block.svelte';

    let blocks = [];

    const getBlocks = async () => {
        try {
            const res = await fetch(`/api/blocks/all`);
            
            if (res.status === 200) {
                return res.json();
            } else {
                return [];
            }
        } catch (err) {
            return [];
        } 
    }

    onMount(async () => {
        blocks = await getBlocks();
    })
</script>

<div class="main">
    <Header></Header>
    <div class="main__contents">
        {#each blocks as block}
            <Block block={block}></Block>
        {/each}
    </div>
</div>

<style>
    .main {
        width: 100%;
        min-height: 100vh;
        background-color: #0D1117;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }
    .main__contents {
        width: 890px;
        padding: 50px 0;
        display: flex;
        flex-flow: column;
        gap: 20px;
    }
</style>