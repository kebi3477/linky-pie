<script>
    import { navigate } from "svelte-routing/src/history";
    import heart from '../public/images/icons/heart-gray-icon.svg';
    import activeHeart from '../public/images/icons/heart-blue-icon.svg';
    import { getTimeDifferenceDescription } from '../utils/util';

    export let block;

    let amILikes = block.amILikes > 0;
    let heartImage = amILikes ? activeHeart : heart;

    function redirect(url) {
        navigate(`/${url}`, { replace: true });
    }

    const openLink = link => {
        window.open(link);
    }

    const doLikes = async () => {
        try {
            const res = await fetch(`/api/blocks/${block.id}/likes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
    
            if (res.status === 201) {
                await res.json();
                amILikes = true;
                heartImage = activeHeart;
                block.likesCount++;
            }
        } catch (err) {
            alert('좋아요 실패!');
            console.error(err);
        }
    }

    const doUnLikes = async () => {
        try {
            const res = await fetch(`/api/blocks/${block.id}/likes`, {
                method: 'Delete',
                headers: { 'Content-Type': 'application/json' }
            })
    
            if (res.status === 200) {
                await res.json();
                amILikes = false;
                heartImage = heart;
                block.likesCount--;
            }
        } catch (err) {
            alert('좋아요 취소 실패!');
            console.error(err);
        }
    }

    const handleLikes = async () => {
        if (amILikes) {
            await doUnLikes();
        } else {
            await doLikes();
        }
    }

</script>

<div class="block">
    <div class="block__header">
        <div class="profile">
            <button class="profile__image" on:click={() => redirect(`user/${block.user.id}`)}>
                <img src="{block.user.image}" alt="user_image">
            </button>
            <div class="profile__data">
                <button class="profile__name" on:click={() => redirect(`user/${block.user.id}`)}>{block.user.name}</button>
                <div class="profile__write_date">{getTimeDifferenceDescription(block.createdAt)}</div>
            </div>
        </div>
        <div class="block__button"></div>
    </div>
    <div class="block__body">
        <div></div>
        <div class="block__content">{block.content}</div>
        <div></div>
        <button class="bookmark" on:click={() => openLink(block.link)}>
            <div class="bookmark__title">{block.title}</div>
            <div class="bookmark__writer">by. 고동고동</div>
        </button>
    </div>
    <div class="block__footer">
        <button class="block__footer-text likes" on:click={handleLikes}>
            <img src="{heartImage}" alt="heart"> {block.likesCount}개
        </button>
        <button class="block__footer-text comments" on:click={() => redirect(`detail/${block.id}`)}>댓글 {block.commentsCount}개</button>
        <!-- <div class="block__footer-text scrap">스크랩 2회</div> -->
    </div>
</div>

<style>
    .block {
        width: 100%;
        background-color: #21262C;
        border-radius: 10px;
        padding: 20px;
    }
    .block__header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
    .profile {
        display: grid;
        grid-template-columns: 50px auto;
        gap: 10px;
        align-items: center;
    }
    .profile__image {
        width: 45px;
        height: 45px;
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
        font-size: 18px;
        font-family: 'Ramche', sans-serif;
        color: #fff;
    }
    .profile__write_date {
        font-size: 12px;
        color: #777777;
        margin-top: 3px;
    }
    .block__body {
        display: grid;
        grid-template-columns: 50px auto;
        gap: 10px;
    }
    .block__content {
        font-size: 15px;
        color: #D6D6D6;
    }
    .bookmark {
        width: 100%;
        margin-left: 10px;
        background-color: #2F3843;
        border: 1px solid #6A6A6A;
        border-radius: 10px;
        padding: 20px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        cursor: pointer;
    }
    .bookmark__title {
        color: #fff;
        font-size: 14px;
        font-weight: bold;
    }
    .bookmark__writer {
        font-size: 14px;
        color: #787878;
    }
    .block__footer {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 10px;
    }
    .block__footer-text {
        font-size: 14px;
        color: #787878;
        cursor: pointer;
    }
    .block__footer-text:hover {
        text-decoration: underline;
    }
    .likes {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
    }
</style>