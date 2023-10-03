<script>
    import { onMount } from "svelte";
    import Header from "../components/Header.svelte";
    import Block from "../components/Block.svelte";
    import CommentCP from "../components/comment/CommentCP.svelte";

    export let block_id;

    let block;
    let comments = [];
    let content;

    const getBlock = async () => {
        try {
            const res = await fetch(`/api/blocks/${block_id}`);
            
            if (res.status === 200) {
                return res.json();
            } else {
                return [];
            }
        } catch (err) {
            return [];
        } 
    }

    function handleKeydown(event) {
        if (event.key === 'Enter') {
            createComment();
        }
    }

    async function createComment() {
        try {
            const data = { content };
            const res = await fetch(`/api/blocks/${block_id}/comments`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
    
            if (res.status === 201) {
                await res.json();
                content = '';
                block.commentsCount++;
                reload();
            } else {
                alert('댓글 생성 실패!');
            }
        } catch (err) {
            alert('댓글 생성 실패!');
            console.error(err);
        }
    }

    const getComments = async () => {
        try {
            const res = await fetch(`/api/blocks/${block_id}/comments`);
            
            if (res.status === 200) {
                return res.json();
            } else {
                return [];
            }
        } catch (err) {
            return [];
        }
    }

    const reload = async () => {
        comments = await getComments();
    }

    onMount(async () => {
        block = await getBlock();
        comments = await getComments();
    })
</script>

<div class="detail">
    <Header></Header>
    <div class="detail__contents">
        {#if block}
            <Block block={block}></Block>
        {/if}
        <div class="detail__comments">
            {#each comments as comment}
                <CommentCP comment={comment} on:deleted={reload}></CommentCP> 
            {/each}
        </div>
        <div class="comment__wrap">
            <input name="comment" id="comment" class="comment__input" bind:value={content} on:keydown={handleKeydown} />
            <button class="comment__button" on:click={createComment}>작성</button>
        </div>
    </div>
</div>

<style>
    .detail {
        width: 100%;
        min-height: 100vh;
        background-color: #0D1117;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }
    .detail__contents {
        width: 890px;
        padding: 50px 0;
        display: flex;
        flex-flow: column;
        gap: 20px;
    }
    .detail__comments {
        display: flex;
        flex-flow: column nowrap;
        gap: 15px;
        padding: 10px 0;
    }
    .comment__wrap {
        display: flex;
        gap: 10px;
    }
    .comment__input {
        width: 100%;
        border-radius: 10px;
        resize: none;
        padding: 10px;
        outline: none;
    }
    .comment__button {
        width: 100px;
        border-radius: 10px;
        background-color: #21262C;
        color: #fff;
    }

</style>