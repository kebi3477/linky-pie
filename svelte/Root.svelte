<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing/src/history";
    import { userData } from './utils/store.js';
    
    async function isLogin() {
        const res = await fetch('/api/users/me');

        if (res.status === 401) {
            return false;
        } else {
            const json = await res.json();
            userData.set(json);
            return true;            
        }
    }

    onMount(async () => {
        const currentPath = location.pathname;
        const searchParam = location.search;
        const hash = location.hash;
        
        if (await isLogin()) {
            navigate(currentPath + hash + searchParam, { replace: true });
        } else {
            navigate("/intro", { replace: true });
        }
    })
</script>