<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<h1>Welcome to SvelteKit</h1>
<p><a href="/login/ms">Login</a></p>
<p>
{data.OIDC_ROOT_URL}
</p>
<p>
{data.CLIENT_ID}
</p>
<p>
{data.REDIRECT_URL}
</p>