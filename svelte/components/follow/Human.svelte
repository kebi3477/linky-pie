<script>
    import dots from '../../public/images/icons/dots-icon.svg'
    import defaultImage from '../../public/images/default-image.svg'
</script>

<div class="human">
    <img src="{defaultImage}" alt="default_image" class="human__image" />
    <div class="human__name">Linky pie_12</div>
    <button class="human__button follow">팔로잉</button>
    <div class="human__menu-button">
        <img src="{dots}" alt="menu_button">
    </div>
</div>

<style>
    .human {
        width: 100%;
        padding: 15px 30px;
        background-color: #21262C;
        border-radius: 10px;
        display: grid;
        grid-template-columns: 55px 1fr auto 20px;
        align-items: center;
        gap: 10px;
    }
    .human__name {
        font-size: 15px;
        color: #fff;
    }
    .human__button {
        padding: 5px 30px;
        background-color: #58616F;
        border-radius: 7px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
    }
    .human__menu-button {
        cursor: pointer;
    }
</style>