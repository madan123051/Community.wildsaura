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
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(11,12,14,0.98)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(212,163,115,0.15)', padding: '0.6rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 700, margin: '0 auto', width: '100%', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: '1 1 auto' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, background: 'linear-gradient(135deg, #d4a373, #e9c46a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', whiteSpace: 'nowrap' }}>
              🌿 WildSaura Community
            </span>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(233,196,106,0.1)', border: '1px solid rgba(233,196,106,0.2)', borderRadius: 20, padding: '0.2rem 0.6rem', fontSize: '0.78rem', color: '#e9c46a', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
              onClick={() => setShowMembersModal(true)}
            >
              👥 {memberCount}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            {user ? (
              isMember ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(76,205,196,0.12)', border: '1px solid rgba(76,205,196,0.3)', color: '#4ECDC4', borderRadius: 20, padding: '0.35rem 0.7rem', fontSize: '0.8rem', fontWeight: 600 }}>✅ Member</span>
              ) : (
                <button
                  style={{ background: 'linear-gradient(135deg, #d4a373, #e9c46a)', color: '#0b0c0e', border: 'none', borderRadius: 20, padding: '0.35rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, opacity: joining ? 0.7 : 1 }}
                  onClick={joinCommunity}
                  disabled={joining}
                >{joining ? '...' : '🤝 Join'}</button>
              )
            ) : (
              <button style={{ background: 'linear-gradient(135deg, #d4a373, #e9c46a)', color: '#0b0c0e', border: 'none', borderRadius: 20, padding: '0.35rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }} onClick={() => setShowAuthModal(true)}>🔑 Login</button>
            )}
            <button
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(212,163,115,0.15)', border: '1px solid rgba(212,163,115,0.3)', color: '#d4a373', borderRadius: 20, padding: '0.35rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
              onClick={() => requireLogin(() => { setEditingPost(null); setShowPostModal(true); })}
            >✏️ Post</button>
            <button
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(212,163,115,0.1)', border: '1px solid rgba(212,163,115,0.25)', color: '#d4a373', borderRadius: 20, padding: '0.35rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
              onClick={() => setShowShareModal(true)}
            >📤</button>
            {user && (
              <button style={{ background: 'none', border: '1px solid #2e323a', color: '#8a8f98', borderRadius: 20, padding: '0.35rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }} onClick={logout} title="Sign out">↩</button>
            )}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, maxWidth: 700, margin: '0 auto', width: '100%', padding: '1rem 1rem 3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Guest banner */}
        {!user && !authLoading && (
          <div style={{ background: 'rgba(212,163,115,0.1)', border: '1px solid rgba(212,163,115,0.3)', borderRadius: 14, padding: '1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ color: '#e9c46a', fontWeight: 700, fontSize: '1.1rem' }}>🌍 Welcome to WildSaura Community!</div>
            <div style={{ color: '#b0b5c0', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Browse posts freely — no login needed! 🎉<br />
              Join to post, like, comment, and connect with wildlife lovers.
            </div>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button style={{ background: 'linear-gradient(135deg, #d4a373, #e9c46a)', color: '#0b0c0e', fontWeight: 700, cursor: 'pointer', border: 'none', padding: '0.6rem 1.6rem', borderRadius: 30, fontSize: '0.95rem' }} onClick={() => setShowAuthModal(true)}>
                🔑 Login to Join
              </button>
              <button style={{ background: 'rgba(212,163,115,0.1)', border: '1px solid rgba(212,163,115,0.25)', color: '#d4a373', borderRadius: 20, padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowShareModal(true)}>
                📤 Share with Friends
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
      <footer style={{ borderTop: '1px solid #1e2128', padding: '1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.8rem' }}>
        🌿 WildSaura Community · Shared across wildsaura.com · drishya · market.wildsaura.com
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
