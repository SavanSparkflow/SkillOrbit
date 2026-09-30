import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { useAuthStore } from '../../store/authStore';
import Button from '../common/Button';
import Badge from '../common/Badge';
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Send,
  Plus,
  HelpCircle,
  Clock,
  ShieldCheck,
  User,
  CornerDownRight,
  Filter,
} from 'lucide-react';

const LessonDiscussions = ({ courseId, lessonId }) => {
  const { user } = useAuthStore();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'resolved' | 'unresolved'

  // New Question Form
  const [isAsking, setIsAsking] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Reply Input State per Discussion
  const [replyTextMap, setReplyTextMap] = useState({});
  const [submittingReplyId, setSubmittingReplyId] = useState(null);

  const fetchDiscussions = async () => {
    if (!lessonId) return;
    try {
      setLoading(true);
      const res = await apiClient.get(`/discussions/lesson/${lessonId}`);
      setDiscussions(res.data.discussions || []);
    } catch (err) {
      console.error('Failed to fetch discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [lessonId]);

  // Submit New Question
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setSubmittingQuestion(true);
      const res = await apiClient.post('/discussions', {
        courseId,
        lessonId,
        title,
        content,
      });
      setDiscussions([res.data.discussion, ...discussions]);
      setTitle('');
      setContent('');
      setIsAsking(false);
    } catch (err) {
      alert(err.message || 'Failed to post question');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  // Submit Reply
  const handleAddReply = async (discussionId) => {
    const text = replyTextMap[discussionId];
    if (!text || !text.trim()) return;

    try {
      setSubmittingReplyId(discussionId);
      const res = await apiClient.post(`/discussions/${discussionId}/answers`, {
        content: text.trim(),
      });
      setDiscussions((prev) =>
        prev.map((d) => (d._id === discussionId ? res.data.discussion : d))
      );
      setReplyTextMap((prev) => ({ ...prev, [discussionId]: '' }));
    } catch (err) {
      alert(err.message || 'Failed to submit reply');
    } finally {
      setSubmittingReplyId(null);
    }
  };

  // Upvote Question
  const handleUpvote = async (discussionId) => {
    try {
      const res = await apiClient.post(`/discussions/${discussionId}/upvote`);
      setDiscussions((prev) =>
        prev.map((d) => (d._id === discussionId ? res.data.discussion : d))
      );
    } catch (err) {
      alert(err.message || 'Failed to upvote');
    }
  };

  // Toggle Resolved
  const handleToggleResolve = async (discussionId) => {
    try {
      const res = await apiClient.put(`/discussions/${discussionId}/resolve`);
      setDiscussions((prev) =>
        prev.map((d) => (d._id === discussionId ? res.data.discussion : d))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const filteredDiscussions = discussions.filter((d) => {
    if (filter === 'resolved') return d.isResolved;
    if (filter === 'unresolved') return !d.isResolved;
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header & Ask Question Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Lesson Q&A Discussion ({discussions.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ask doubts, share ideas, and discuss concepts with instructors and peers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unresolved')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'unresolved' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unresolved
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'resolved' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Resolved
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAsking(!isAsking)}
          >
            {isAsking ? 'Close Form' : '+ Ask a Question'}
          </Button>
        </div>
      </div>

      {/* Ask Question Form */}
      {isAsking && (
        <form
          onSubmit={handleCreateQuestion}
          className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-slate-900/90 space-y-4 shadow-xl"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
            <h4 className="text-sm font-bold text-white">Post Your Question to this Lesson</h4>
          </div>

          <input
            type="text"
            placeholder="e.g. How does async/await handle error propagation in Node.js?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-indigo-500"
            required
          />

          <textarea
            rows="3"
            placeholder="Describe your question or code issue in detail..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-indigo-500"
            required
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAsking(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              size="sm"
              loading={submittingQuestion}
            >
              Publish Question
            </Button>
          </div>
        </form>
      )}

      {/* Discussion Threads List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading discussions...</div>
      ) : filteredDiscussions.length > 0 ? (
        <div className="space-y-4">
          {filteredDiscussions.map((d) => {
            const hasUpvoted = d.upvotes?.includes(user?._id);
            const isAuthorOrInstructor =
              user?._id === d.user?._id || user?.role === 'teacher' || user?.role === 'admin';

            return (
              <div
                key={d._id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4 shadow-sm hover:border-slate-700 transition-colors"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        d.user?.avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
                      }
                      alt={d.user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{d.user?.name || 'Student'}</span>
                        {d.user?.role === 'teacher' && (
                          <Badge variant="indigo" className="text-[10px] px-1.5 py-0">Instructor</Badge>
                        )}
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                        {d.isResolved && (
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Resolved
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 mt-1">{d.title}</h4>
                    </div>
                  </div>

                  {/* Upvote & Resolve Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleUpvote(d._id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                        hasUpvoted
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/30'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                      title="Upvote this question"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{d.upvotes?.length || 0}</span>
                    </button>

                    {isAuthorOrInstructor && (
                      <button
                        onClick={() => handleToggleResolve(d._id)}
                        className={`p-1.5 rounded-xl border text-xs transition-colors ${
                          d.isResolved
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                        title={d.isResolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Question Details */}
                <p className="text-xs sm:text-sm text-slate-300 pl-11 whitespace-pre-line leading-relaxed">
                  {d.content}
                </p>

                {/* Answers Thread */}
                {d.answers?.length > 0 && (
                  <div className="pl-6 sm:pl-11 space-y-3 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Replies ({d.answers.length})
                    </span>
                    {d.answers.map((ans, aIdx) => (
                      <div
                        key={aIdx}
                        className={`p-3.5 rounded-xl text-xs space-y-2 border ${
                          ans.isInstructorAnswer
                            ? 'bg-indigo-950/30 border-indigo-500/30'
                            : 'bg-slate-950/50 border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                ans.user?.avatar ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
                              }
                              alt={ans.user?.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-semibold text-white">{ans.user?.name || 'Peer'}</span>
                            {ans.isInstructorAnswer && (
                              <Badge variant="indigo" className="text-[9px] px-1 py-0 flex items-center gap-1">
                                <ShieldCheck className="w-2.5 h-2.5" /> Instructor
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {new Date(ans.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed pl-7">{ans.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Reply Form */}
                <div className="pl-6 sm:pl-11 flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Write a helpful answer or solution..."
                    value={replyTextMap[d._id] || ''}
                    onChange={(e) =>
                      setReplyTextMap((prev) => ({ ...prev, [d._id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddReply(d._id);
                      }
                    }}
                    className="flex-1 bg-slate-950 text-xs text-white rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => handleAddReply(d._id)}
                    disabled={submittingReplyId === d._id || !replyTextMap[d._id]?.trim()}
                    className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shadow"
                  >
                    <Send className="w-3.5 h-3.5" /> Reply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 space-y-3 glass-panel rounded-2xl border border-slate-800 bg-slate-900/40">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No discussions yet for this lesson</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Have a question regarding this lecture? Be the first to ask and start a helpful discussion.
          </p>
          <Button variant="primary" size="sm" onClick={() => setIsAsking(true)}>
            Ask First Question
          </Button>
        </div>
      )}
    </div>
  );
};

export default LessonDiscussions;
