// ============================================================
// Supabase 클라이언트 + 인증 + 데이터 동기화
// ============================================================

const SUPABASE_URL = 'https://crhpzgkjajbchdgrbwpx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KHoLq_Iu12vW6xWYfjCq-g_nFaGKg6D';

const SB = {
  client: null,
  user: null,
  _ready: false,

  // ── 초기화 ──
  async init() {
    if (typeof supabase === 'undefined' || !supabase.createClient) {
      console.warn('Supabase SDK not loaded');
      return;
    }
    this.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 세션 복원
    const { data: { session } } = await this.client.auth.getSession();
    if (session) {
      this.user = session.user;
      await this._pullFromCloud();
    }

    // 인증 상태 변경 감지
    this.client.auth.onAuthStateChange(async (event, session) => {
      this.user = session?.user || null;
      if (event === 'SIGNED_IN' && session) {
        await this._pullFromCloud();
        if (typeof App !== 'undefined') App.showHome();
      }
      if (event === 'SIGNED_OUT') {
        if (typeof App !== 'undefined') App.showHome();
      }
    });

    this._ready = true;
  },

  // ── Google 로그인 ──
  async signInWithGoogle() {
    if (!this.client) return;
    const { error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) console.error('Google login error:', error.message);
  },

  // ── 로그아웃 ──
  async signOut() {
    if (!this.client) return;
    await this.client.auth.signOut();
    this.user = null;
  },

  // ── 클라우드에서 데이터 가져오기 ──
  async _pullFromCloud() {
    if (!this.client || !this.user) return;

    const { data, error } = await this.client
      .from('hangle_users')
      .select('*')
      .eq('user_id', this.user.id)
      .maybeSingle();

    if (error) { console.error('Pull error:', error); return; }
    if (!data) return; // 새 유저, 아직 데이터 없음

    // 클라우드 vs 로컬 비교: 최신 데이터 사용
    const localXP = parseInt(localStorage.getItem('hg_xp')) || 0;
    const cloudXP = data.xp || 0;

    if (cloudXP >= localXP) {
      // 클라우드가 최신 → 로컬에 반영
      localStorage.setItem('hg_xp', data.xp || 0);
      if (data.progress) localStorage.setItem('hg_prog', JSON.stringify(data.progress));
      if (data.srs_data) localStorage.setItem('hg_srs', JSON.stringify(data.srs_data));
      if (data.streak_count !== undefined) {
        localStorage.setItem('hg_streak', JSON.stringify({
          c: data.streak_count,
          d: data.streak_date || ''
        }));
      }
      // App 상태 갱신
      if (typeof App !== 'undefined') {
        App.xp = data.xp || 0;
      }
    } else {
      // 로컬이 최신 → 클라우드에 업로드
      await this.pushToCloud();
    }
  },

  // ── 클라우드에 데이터 저장 ──
  async pushToCloud() {
    if (!this.client || !this.user) return;

    const xp = parseInt(localStorage.getItem('hg_xp')) || 0;
    const progress = JSON.parse(localStorage.getItem('hg_prog') || '{}');
    const srsData = JSON.parse(localStorage.getItem('hg_srs') || '{}');
    const streak = JSON.parse(localStorage.getItem('hg_streak') || '{}');

    const row = {
      user_id: this.user.id,
      email: this.user.email,
      display_name: this.user.user_metadata?.full_name || this.user.user_metadata?.name || '',
      avatar_url: this.user.user_metadata?.avatar_url || '',
      xp,
      progress,
      srs_data: srsData,
      streak_count: streak.c || 0,
      streak_date: streak.d || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await this.client
      .from('hangle_users')
      .upsert(row, { onConflict: 'user_id' });

    if (error) console.error('Push error:', error);
  },

  // ── 유저 정보 ──
  getDisplayName() {
    if (!this.user) return null;
    return this.user.user_metadata?.full_name
      || this.user.user_metadata?.name
      || this.user.email?.split('@')[0]
      || '사용자';
  },

  getAvatarUrl() {
    return this.user?.user_metadata?.avatar_url || null;
  },

  isLoggedIn() {
    return !!this.user;
  },
};
