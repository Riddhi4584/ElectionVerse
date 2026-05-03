import { motion } from 'framer-motion';

function SkeletonLine({ width = '100%', height = 12, mt = 0 }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 6, marginTop: mt }}
    />
  );
}

function SkeletonCard({ height = 120 }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      padding: 20,
      height,
    }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <SkeletonLine width="60%" height={10} />
          <SkeletonLine width="90%" height={10} mt={8} />
        </div>
      </div>
      <SkeletonLine width="100%" height={10} />
      <SkeletonLine width="75%" height={10} mt={8} />
    </div>
  );
}

export default function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      {/* Hero skeleton */}
      <div style={{
        borderRadius: 20,
        padding: 32,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
      }}>
        <div style={{ flex: 1 }}>
          <SkeletonLine width="40%" height={12} />
          <SkeletonLine width="65%" height={28} mt={14} />
          <SkeletonLine width="80%" height={10} mt={12} />
          <SkeletonLine width="70%" height={10} mt={8} />
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <div className="skeleton" style={{ width: 140, height: 40, borderRadius: 12 }} />
            <div className="skeleton" style={{ width: 110, height: 40, borderRadius: 12 }} />
          </div>
        </div>
        <div className="skeleton" style={{ width: 120, height: 120, borderRadius: '50%', flexShrink: 0 }} />
      </div>

      {/* Journey map skeleton */}
      <div style={{
        borderRadius: 16,
        padding: 24,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <SkeletonLine width="30%" height={10} />
        <div style={{ display: 'flex', gap: 20, marginTop: 20, alignItems: 'center' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
              <div className="skeleton" style={{ width: 54, height: 54, borderRadius: '50%' }} />
              {i < 4 && <div className="skeleton" style={{ width: 60, height: 3, borderRadius: 2 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Smart cards skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
      </div>

      {/* Learning cards skeleton */}
      <div style={{ display: 'flex', gap: 14, overflow: 'hidden' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ minWidth: 200, borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 12 }} />
            <SkeletonLine width="80%" height={10} />
            <SkeletonLine width="100%" height={10} mt={8} />
            <SkeletonLine width="90%" height={10} mt={8} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
