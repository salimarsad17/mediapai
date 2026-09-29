import React from 'react';
import { useLms } from '../../context/LmsContext';
import { School, Award } from 'lucide-react';

interface KopSuratProps {
  documentTitle?: string;
  subTitle?: string;
  compact?: boolean;
  className?: string;
}

export const KopSurat: React.FC<KopSuratProps> = ({
  documentTitle,
  subTitle,
  compact = false,
  className = '',
}) => {
  const { schoolConfig } = useLms();

  const govHeader = schoolConfig.governmentHeader || 'PEMERINTAH KABUPATEN WAY KANAN';
  const deptHeader = schoolConfig.departmentHeader || 'DINAS PENDIDIKAN';
  const schoolName = schoolConfig.name || 'UPT SMPN 2 REBANG TANGKAS';

  return (
    <div className={`w-full text-slate-900 ${className}`}>
      <div className="flex items-center justify-between gap-4 pb-2">
        {/* Left Emblem / Crest */}
        <div className="shrink-0 flex items-center justify-center">
          <div
            className={`rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-amber-400 flex items-center justify-center font-bold shadow-xs border border-slate-800 ${
              compact ? 'w-10 h-10' : 'w-14 h-14'
            }`}
          >
            <School className={compact ? 'w-5 h-5' : 'w-8 h-8'} />
          </div>
        </div>

        {/* Center Official Kop Text */}
        <div className="text-center flex-1 space-y-0.5">
          <h3
            className={`font-bold tracking-widest text-slate-800 uppercase ${
              compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'
            }`}
          >
            {govHeader}
          </h3>
          <h2
            className={`font-black tracking-wider text-slate-900 uppercase ${
              compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
            }`}
          >
            {deptHeader}
          </h2>
          <h1
            className={`font-black tracking-wide text-blue-950 uppercase ${
              compact ? 'text-sm sm:text-base' : 'text-base sm:text-xl'
            }`}
          >
            {schoolName}
          </h1>
          <p
            className={`text-slate-600 font-medium ${
              compact ? 'text-[9px] sm:text-[10px]' : 'text-[11px] sm:text-xs'
            }`}
          >
            Alamat: {schoolConfig.address} • NPSN: <span className="font-mono font-bold">{schoolConfig.npsn}</span>
          </p>
        </div>

        {/* Right Secondary Badge (Education & Culture Icon) */}
        <div className="shrink-0 hidden sm:flex items-center justify-center">
          <div
            className={`rounded-xl bg-slate-100 text-blue-800 border border-slate-300 flex items-center justify-center font-bold ${
              compact ? 'w-10 h-10' : 'w-14 h-14'
            }`}
            title="Tut Wuri Handayani / Kurikulum Nasional"
          >
            <Award className={compact ? 'w-5 h-5' : 'w-7 h-7 text-blue-700'} />
          </div>
        </div>
      </div>

      {/* Official Double Line (Garis Ganda Kop Surat Resmi) */}
      <div className="w-full mt-1 mb-3">
        <div className="border-t-2 border-slate-900 w-full"></div>
        <div className="border-t border-slate-900 w-full mt-0.5"></div>
      </div>

      {/* Optional Document Title Bar */}
      {(documentTitle || subTitle) && (
        <div className="text-center my-2">
          {documentTitle && (
            <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900 tracking-wider">
              {documentTitle}
            </h4>
          )}
          {subTitle && (
            <p className="text-[10px] sm:text-xs text-slate-600 font-medium mt-0.5">
              {subTitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
