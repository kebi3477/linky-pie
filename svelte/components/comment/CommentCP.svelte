<script>
    import { createEventDispatcher } from 'svelte';

    import { getTimeDifferenceDescription } from "../../utils/util";
    
    const dispatch = createEventDispatcher();

    const deleteComplete = () => {
        dispatch('deleted');
    }

    const deleteComment = async () => {
        if (!confirm('댓글을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const res = await fetch(`/api/blocks/${comment.block.id}/comments/${comment.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
    
            if (res.status === 200) {
                await res.json();
                deleteComplete();
            } else {
                alert('댓글 삭제 실패!');
            }
        } catch (err) {
            alert('댓글 삭제 실패!');
            console.error(err);
        }
    }
    
    export let comment;
</script>

<div class="comment">
    <div class="profile">
        <div class="profile__image">
            <img src="{comment.user.image}" alt="user_image">
        </div>
        <div class="profile__name">{comment.user.name}</div>
    </div>
    <div class="comment__content">{comment.content}</div>
    <div class="comment__write_date">{getTimeDifferenceDescription(comment.createdAt)}</div>
    {#if comment.isMine}
        <button class="comment__button" on:click={deleteComment}>삭제</button>
    {/if}
</div>

<style>
    .comment {
        display: grid;
        grid-template-columns: 50px 1fr auto auto;
        gap: 10px;
        align-items: center;
    }
    .profile {
        display: flex;
        flex-flow: column nowrap;
        gap: 5px;
        align-items: center;
        justify-content: center;
    }
    .profile__image {
        width: 35px;
        height: 35px;
        border-radius: 100%;
        background-color: #fff;
        overflow: hidden;
    }
    .profile__image > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .profile__name {
        font-size: 12px;
        font-family: 'Ramche', sans-serif;
        color: #fff;
    }
    .comment__content {
        color: #fff;
    }
    .comment__write_date {
        font-size: 12px;
        color: #777777;
        margin-top: 3px;
    }
    .comment__button {
        padding: 5px;
        background-color: #a42222;
        color: #fff;
        border-radius: 5px;
    }
</style>