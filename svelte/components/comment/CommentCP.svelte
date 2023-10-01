<script>
    import { getTimeDifferenceDescription } from "../../utils/util";

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
</div>

<style>
    .comment {
        display: grid;
        grid-template-columns: 50px 1fr auto;
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
</style>