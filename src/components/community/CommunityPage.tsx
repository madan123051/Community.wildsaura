'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { useMembers } from '@/hooks/useMembers';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { ShareModal } from './ShareModal';
import { MembersModal } from './MembersModal';
import { AuthModal } from './AuthModal';
import { Toast } from '@/components/ui/Toast';
import type { Post } from '@/types/community';

const COMMUNITY_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}`
    : 'https://community.wildsaura.com';

const NAV_SITES = [
  { label: 'WildSaura', href: 'https://wildsaura.com', emoji: '🏠' },
  { label: 'Drishya', href: 'https://drishya.wildsaura.com', emoji: '📸' },
  { label: 'Market', href: 'https://market.wildsaura.com', emoji: '🛒' },
];

export function CommunityPage() {
  const { user, loading: authLoading, loginWithGoogle, loginWithFacebook, loginWithApple, logout } = useAuth();
  const { posts, loading: postsLoading, createPost, updatePost, deletePost, toggleLike, addComment } = usePosts(user);
  const { members, memberCount, isMember, joining, joinCommunity, ensureMember } = useMembers(user);

  const [showPostModal, setShowPostModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const requireLogin = (action: () => void) => {
    if (!user) { setShowAuthModal(true); return; }
    action();
  };

  const handleCreatePost = async (text: string, category: string, story: string, imageFile: File | null) => {
    if (!user) return;
    setSubmitting(true);
    setUploadProgress(imageFile ? '📷 Compressing image...' : '');
    try {
      if (editingPost) {
        setUploadProgress(imageFile ? '☁️ Uploading photo...' : '💾 Saving...');
        await updatePost(editingPost.id, text, category, story, imageFile, editingPost.imageUrl);
        showToast('✅ Post updated!');
      } else {
        if (imageFile) setUploadProgress('☁️ Uploading photo...');
        const result = await createPost(text, category, story, imageFile);
        if (result.success) {
          await ensureMember();
          showToast(result.imageUploaded ? '✅ Post published with photo!' : '✅ Post published!');
        }
      }
      setShowPostModal(false);
      setEditingPost(null);
    } catch (err: any) {
      showToast(`❌ Failed: ${err?.message || 'Try again'}`);
    }
    setSubmitting(false);
    setUploadProgress('');
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setShowPostModal(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    await deletePost(postId);
    showToast('🗑️ Post deleted');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(COMMUNITY_URL);
      showToast('✅ Link copied!');
    } catch {
      window.prompt('Copy this link:', COMMUNITY_URL);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--wa-bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── TOP NAV STRIP ── */}
      <div style={{
        background: 'rgba(5,6,8,0.95)',
        borderBottom: '1px solid rgba(212,163,115,0.08)',
        padding: '0.35rem 1rem',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Site links */}
          <div style={{ display: 'flex', gap: '0.15rem' }}>
            {NAV_SITES.map(site => (
              <a
                key={site.href}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  color: '#8a8f98', fontSize: '0.72rem', fontWeight: 500,
                  textDecoration: 'none', padding: '0.2rem 0.55rem', borderRadius: 20,
                  transition: 'all 0.2s',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#d4a373'; (e.currentTarget as HTMLElement).style.background = 'rgba(212,163,115,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8a8f98'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span>{site.emoji}</span> {site.label}
              </a>
            ))}
          </div>
          {/* Community badge */}
          <span style={{ fontSize: '0.7rem', color: 'rgba(212,163,115,0.45)', letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase' }}>Community</span>
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(11,12,14,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,163,115,0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0.7rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>

          {/* LEFT — Logo + title + members */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
            {/* Logo circle */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a1200, #2e1f00)',
              border: '1.5px solid rgba(212,163,115,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', flexShrink: 0,
              boxShadow: '0 0 12px rgba(212,163,115,0.15)',
            }}>🌿</div>

            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '0.98rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #d4a373 0%, #e9c46a 50%, #d4a373 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                letterSpacing: '-0.01em', lineHeight: 1.1, whiteSpace: 'nowrap',
              }}>WildSaura</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(212,163,115,0.5)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>Community</div>
            </div>

            {/* Members pill */}
            <button
              onClick={() => setShowMembersModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                background: 'rgba(233,196,106,0.08)', border: '1px solid rgba(233,196,106,0.2)',
                borderRadius: 20, padding: '0.22rem 0.6rem',
                fontSize: '0.75rem', color: '#e9c46a', fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(233,196,106,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(233,196,106,0.08)'; }}
            >
              <span style={{ fontSize: '0.8rem' }}>👥</span> {memberCount}
            </button>
          </div>

          {/* RIGHT — Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>

            {/* Login / Member / Join */}
            {user ? (
              isMember ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  background: 'rgba(76,205,196,0.1)', border: '1px solid rgba(76,205,196,0.25)',
                  color: '#4ECDC4', borderRadius: 20, padding: '0.3rem 0.65rem',
                  fontSize: '0.78rem', fontWeight: 700,
                }}>
                  <span style={{ fontSize: '0.7rem' }}>✅</span> Member
                </div>
              ) : (
                <button
                  onClick={joinCommunity}
                  disabled={joining}
                  style={{
                    background: 'linear-gradient(135deg, #d4a373, #e9c46a)',
                    color: '#0b0c0e', border: 'none', borderRadius: 20,
                    padding: '0.3rem 0.75rem', cursor: 'pointer',
                    fontSize: '0.78rem', fontWeight: 700, opacity: joining ? 0.7 : 1,
                    boxShadow: '0 2px 10px rgba(212,163,115,0.3)',
                  }}
                >{joining ? '...' : '🤝 Join'}</button>
              )
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #d4a373, #e9c46a)',
                  color: '#0b0c0e', border: 'none', borderRadius: 20,
                  padding: '0.3rem 0.75rem', cursor: 'pointer',
                  fontSize: '0.78rem', fontWeight: 700,
                  boxShadow: '0 2px 10px rgba(212,163,115,0.25)',
                }}>🔑 Login</button>
            )}

            {/* Post button */}
            <button
              onClick={() => requireLogin(() => { setEditingPost(null); setShowPostModal(true); })}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                background: 'rgba(212,163,115,0.12)', border: '1px solid rgba(212,163,115,0.3)',
                color: '#d4a373', borderRadius: 20, padding: '0.3rem 0.7rem',
                cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,163,115,0.22)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,163,115,0.12)'; }}
            >
              <span>✏️</span> Post
            </button>

            {/* Share button */}
            <button
              onClick={() => setShowShareModal(true)}
              title="Share"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34,
                background: 'rgba(212,163,115,0.08)', border: '1px solid rgba(212,163,115,0.2)',
                color: '#d4a373', borderRadius: '50%', cursor: 'pointer',
                fontSize: '0.9rem', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,163,115,0.18)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,163,115,0.08)'; }}
            >📤</button>

            {/* Logout */}
            {user && (
              <button
                onClick={logout}
                title="Sign out"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 34, height: 34,
                  background: 'none', border: '1px solid rgba(138,143,152,0.2)',
                  color: '#6b7280', borderRadius: '50%', cursor: 'pointer',
                  fontSize: '0.85rem', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.4)'; (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(138,143,152,0.2)'; (e.currentTarget as HTMLElement).style.color = '#6b7280'; }}
              >↩</button>
            )}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, maxWidth: 700, margin: '0 auto', width: '100%', padding: '1rem 1rem 3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Guest banner */}
        {!user && !authLoading && (
          <div style={{ background: 'rgba(212,163,115,0.07)', border: '1px solid rgba(212,163,115,0.2)', borderRadius: 16, padding: '1.2rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ color: '#e9c46a', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>🌍 Welcome to WildSaura Community!</div>
            <div style={{ color: '#b0b5c0', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Browse posts freely — no login needed! 🎉<br />
              Join to post, like, comment, and connect with wildlife lovers.
            </div>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button style={{ background: 'linear-gradient(135deg, #d4a373, #e9c46a)', color: '#0b0c0e', fontWeight: 700, cursor: 'pointer', border: 'none', padding: '0.65rem 1.8rem', borderRadius: 30, fontSize: '0.95rem', boxShadow: '0 4px 16px rgba(212,163,115,0.3)' }} onClick={() => setShowAuthModal(true)}>
                🔑 Login to Join
              </button>
              <button style={{ background: 'rgba(212,163,115,0.1)', border: '1px solid rgba(212,163,115,0.25)', color: '#d4a373', borderRadius: 30, padding: '0.6rem 1.2rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowShareModal(true)}>
                📤 Share
              </button>
            </div>
          </div>
        )}

        {/* Posts */}
        {postsLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>✨ Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>🌿 No posts yet. Be the first to share!</div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={user}
              onLike={toggleLike}
              onComment={addComment}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLoginClick={() => setShowAuthModal(true)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(30,33,40,0.8)', padding: '1.5rem', textAlign: 'center', color: '#4a4f58', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {NAV_SITES.map(site => (
            <a key={site.href} href={site.href} target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(212,163,115,0.4)', textDecoration: 'none', fontSize: '0.75rem', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#d4a373'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(212,163,115,0.4)'; }}
            >{site.emoji} {site.label}</a>
          ))}
        </div>
        <div>🌿 WildSaura Community · Share the wild beauty of Nepal</div>
      </footer>

      {/* Modals */}
      {showPostModal && (
        <CreatePostModal
          onClose={() => { setShowPostModal(false); setEditingPost(null); }}
          onSubmit={handleCreatePost}
          editingPost={editingPost}
          submitting={submitting}
          uploadProgress={uploadProgress}
        />
      )}
      {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} onCopy={handleCopyLink} communityUrl={COMMUNITY_URL} />}
      {showMembersModal && <MembersModal onClose={() => setShowMembersModal(false)} members={members} memberCount={memberCount} />}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onGoogle={async () => { try { await loginWithGoogle(); setShowAuthModal(false); } catch (e: any) { showToast(`❌ ${e.message}`); } }}
          onFacebook={async () => { try { await loginWithFacebook(); setShowAuthModal(false); } catch (e: any) { showToast(`❌ ${e.message}`); } }}
          onApple={async () => { try { await loginWithApple(); setShowAuthModal(false); } catch (e: any) { showToast(`❌ ${e.message}`); } }}
        />
      )}

      {/* Toast */}
      <Toast message={toast} />
    </div>
  );
}
