<script>
    import heart from '../public/images/icons/heart-blue-icon.svg';
    import { getTimeDifferenceDescription } from '../utils/util';

    const openLink = link => {
        window.open(link);
    }

    export let block;
</script>

<div class="block">
    <div class="block__header">
        <div class="profile">
            <div class="profile__image">
                <img src="{block.user.image}" alt="user_image">
            </div>
            <div class="profile__data">
                <div class="profile__name">{block.user.name}</div>
                <div class="profile__write_date">{getTimeDifferenceDescription(block.createdAt)}</div>
            </div>
        </div>
        <div class="block__button">...</div>
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
        <div class="block__footer-text likes">
            <img src="{heart}" alt="heart"> 5개
        </div>
        <div class="block__footer-text comments">댓글 2개</div>
        <div class="block__footer-text scrap">스크랩 2회</div>
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