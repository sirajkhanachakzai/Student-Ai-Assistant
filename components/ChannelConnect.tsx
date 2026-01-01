
import React from 'react';

const ChannelConnect: React.FC = () => {
  const channels = [
    {
      name: 'WhatsApp',
      icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
      gradient: 'from-emerald-400/10 to-green-500/10',
      textColor: 'text-green-600',
      btnColor: 'bg-green-600 shadow-green-200',
      description: 'Instant AI assistance directly in your chat threads.'
    },
    {
      name: 'Facebook Messenger',
      icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968771.png',
      gradient: 'from-blue-400/10 to-indigo-500/10',
      textColor: 'text-blue-600',
      btnColor: 'bg-blue-600 shadow-blue-200',
      description: 'Connect via Messenger to sync across social accounts.'
    },
    {
      name: 'Slack',
      icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png',
      gradient: 'from-purple-400/10 to-pink-500/10',
      textColor: 'text-purple-600',
      btnColor: 'bg-purple-600 shadow-purple-200',
      description: 'Add EduAssist to your study group workspace.'
    }
  ];

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-12 animate-message">
      <div className="text-center space-y-4">
        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-extrabold uppercase tracking-widest border border-indigo-100">
          Sync Anywhere
        </span>
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Omnichannel Support</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          The same powerful AI experience, available on the platforms you use most every day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <div key={channel.name} className={`flex flex-col p-8 bg-gradient-to-br ${channel.gradient} rounded-[32px] border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group`}>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 p-3">
              <img src={channel.icon} alt={channel.name} className="w-full h-full object-contain" />
            </div>
            <h3 className={`text-xl font-extrabold mb-3 ${channel.textColor}`}>{channel.name}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              {channel.description}
            </p>
            <div className="mt-auto">
              <button className={`w-full py-4 rounded-2xl text-white text-sm font-extrabold shadow-lg transition-all active:scale-95 ${channel.btnColor}`}>
                Enable Integration
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[40px] p-10 relative overflow-hidden group shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-2">Student Success Story</p>
            <h4 className="text-2xl font-bold text-white mb-4 leading-snug italic">
              "The WhatsApp bot is a game changer for cramming. I get instant answers while commuting!"
            </h4>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full bg-slate-700"></div>
              <p className="text-slate-400 text-sm font-medium">— Sarah J, Computer Science Junior</p>
            </div>
          </div>
          <div className="flex-shrink-0">
             <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
               <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelConnect;
