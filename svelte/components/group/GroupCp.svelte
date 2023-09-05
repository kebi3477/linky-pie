<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function changeGroup(group) {
        dispatch('complete', group);
    }

    function editGroup() {
        dispatch('editGroup', group);
    }

    function getGroupLabel(type) {
        switch(type) {
            case 0:
                return '비공개'
            case 1: 
                return '팔로워 공개'
            default:
                return '전체 공개'
        }
    }

    async function deleteGroup(id) {
        if (!confirm('그룹을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const res = await fetch(`/api/groups/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
    
            if (res.status === 200) {
                const data = await res.json();
                data.isDelete = true;

                alert('그룹 삭제 성공!');
                changeGroup(data);
            } else {
                alert('그룹 삭제 실패!');
            }
        } catch (err) {
            alert('그룹 삭제 실패!');
            console.error(err);
        }
    }

    export let group = {
        title: '',
        type: 0,
    };
</script>

<div class="group__component">
    <div class="group__wrap">
        <div class="group__title">{group.title}</div>
        <div class="group__text">{getGroupLabel(group.type)}</div>
    </div>
    <div class="group__wrap">
        <button class="group__button" on:click={editGroup}>편집</button>
        <button class="group__button" on:click={() => deleteGroup(group.id)}>삭제</button>
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