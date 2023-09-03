<script>

</script>

<div class="group__component">
    <div class="group__wrap">
        <div class="group__title">그룹_1</div>
        <div class="group__text">전체공개</div>
    </div>
    <div class="group__wrap">
        <div class="group__button">편집</div>
        <div class="group__button">삭제</div>
    </div>
</div>

<style>
    .group__component {
        width: 100%;
        background-color: #21262C;
        border-radius: 10px;
        padding: 28px 20px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
    }
    .group__wrap {
        display: flex;
        flex-flow: row nowrap;
        gap: 10px;
    }
    .group__title {
        color: #D6D6D6;
        font-size: 15px;
    }
    .group__text {
        color: #5E5E5E;
        font-size: 15px;
    }
    .group__button {
        padding: 6px 34px;
        background-color: #58616F;
        color: #fff;
        font-size: 14px;
        border-radius: 7px;
        cursor: pointer;
    }
</style>