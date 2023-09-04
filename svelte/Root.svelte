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
        if (await isLogin()) {
            navigate("/my-page", { replace: true });
        } else {
            navigate("/intro", { replace: true });
        }
    })
</script>