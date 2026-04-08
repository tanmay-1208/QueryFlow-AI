import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const TeamModal = ({ isOpen, onClose, activeVault, userId, userEmail }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [members, setMembers] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [activeSection, setActiveSection] = useState("members");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && activeVault) {
      fetchMembers();
      fetchInviteCode();
    }
  }, [isOpen, activeVault]);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/team/members?vaultId=${activeVault.id}`);
      setMembers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Members fetch error:", err);
    }
  };

  const fetchInviteCode = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/team/invite/generate`, {
        vaultId: activeVault.id,
        userId: userId
      });
      setInviteCode(res.data.inviteCode);
    } catch (err) {
      console.error("Invite code error:", err);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinVault = async () => {
    if (!joinCode.trim()) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/team/invite/join`, {
        inviteCode: joinCode.trim().toUpperCase(),
        userId: userId,
        userEmail: userEmail
      });
      setMessage("Successfully joined vault: " + res.data.vault?.name);
      setJoinCode("");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid invite code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailInput.trim()) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/team/invite/email`, {
        vaultId: activeVault.id,
        userId: userId,
        email: emailInput.trim(),
        vaultName: activeVault.name
      });
      setMessage(res.data.message || "Invite sent!");
      setEmailInput("");
    } catch (err) {
      setError("Failed to send email invite.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId, memberUserId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/team/members?vaultId=${activeVault.id}&userId=${memberUserId}`);
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err) {
      console.error("Remove member error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="bg-[#0f0f0f] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-white font-black uppercase text-xs tracking-[0.4em] italic">
              Team_Access
            </h2>
            <p className="text-white/20 text-[9px] uppercase tracking-widest mt-1">
              {activeVault?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/20 hover:text-white text-[10px] font-bold border border-white/10 px-3 py-1 rounded-md transition-all uppercase"
          >
            Close
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8">
          {["members", "invite", "join"].map(section => (
            <button
              key={section}
              onClick={() => { setActiveSection(section); setMessage(""); setError(""); }}
              className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeSection === section
                  ? 'bg-[#4182ff] text-white'
                  : 'bg-white/5 text-white/30 hover:text-white border border-white/5'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* MESSAGE / ERROR */}
        {message && (
          <div className="bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-xl p-3 mb-6">
            <p className="text-[#00ff88] text-[9px] font-black uppercase text-center">{message}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6">
            <p className="text-red-400 text-[9px] font-black uppercase text-center">{error}</p>
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeSection === "members" && (
          <div className="space-y-4">
            <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-4">
              {members.length} member{members.length !== 1 ? 's' : ''} in this vault
            </p>

            {/* Owner */}
            <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
              <div>
                <p className="text-[10px] font-black text-white uppercase">You</p>
                <p className="text-[8px] text-white/20 uppercase font-black mt-1">{userEmail}</p>
              </div>
              <span className="bg-[#4182ff]/10 text-[#4182ff] text-[7px] font-black px-2 py-1 rounded-full uppercase tracking-widest border border-[#4182ff]/20">
                Owner
              </span>
            </div>

            {members.map(member => (
              <div key={member.id} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                <div>
                  <p className="text-[10px] font-black text-white/70 uppercase">
                    {member.userEmail || member.userId.slice(0, 12) + "..."}
                  </p>
                  <p className="text-[8px] text-white/20 uppercase font-black mt-1">
                    Joined {new Date(member.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-white/5 text-white/30 text-[7px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                    Member
                  </span>
                  {member.userId !== userId && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.userId)}
                      className="text-red-500/40 hover:text-red-500 text-[9px] font-black uppercase transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            {members.length === 0 && (
              <p className="text-white/10 text-[9px] uppercase font-black text-center py-6">
                No team members yet. Invite someone!
              </p>
            )}
          </div>
        )}

        {/* INVITE TAB */}
        {activeSection === "invite" && (
          <div className="space-y-6">
            {/* Invite Code */}
            <div>
              <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-3">Invite Code</p>
              <div className="flex gap-3">
                <div className="flex-1 bg-black/40 border border-white/10 p-4 rounded-xl">
                  <p className="text-[#4182ff] font-black text-sm tracking-widest text-center">
                    {inviteCode || "Generating..."}
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`px-4 rounded-xl font-black uppercase text-[9px] transition-all ${
                    copied
                      ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/20'
                      : 'bg-white/5 text-white/50 hover:text-white border border-white/10'
                  }`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-white/10 text-[8px] uppercase font-black mt-2">
                Share this code with your team. Expires in 7 days.
              </p>
            </div>

            {/* Email Invite */}
            <div>
              <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-3">Send Email Invite</p>
              <div className="flex gap-3">
                <input
                  className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold"
                  placeholder="Enter email address..."
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                />
                <button
                  onClick={handleSendEmail}
                  disabled={loading}
                  className="bg-[#4182ff] px-6 rounded-xl font-black uppercase text-[9px] text-white hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {loading ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* JOIN TAB */}
        {activeSection === "join" && (
          <div className="space-y-6">
            <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-3">
              Enter Invite Code
            </p>
            <input
              className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold uppercase text-center tracking-widest"
              placeholder="VAULT-XXXXXXXX"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
            />
            <button
              onClick={handleJoinVault}
              disabled={loading || !joinCode.trim()}
              className="w-full bg-[#4182ff] p-4 rounded-xl font-black uppercase text-[9px] text-white shadow-[0_0_20px_rgba(65,130,255,0.2)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Vault"}
            </button>
            <p className="text-white/10 text-[8px] uppercase font-black text-center">
              Ask your vault owner for the invite code
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamModal;

// 12273748