import { m } from 'framer-motion';

import Box from '@mui/material/Box';

import { varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export function Lines({ strokeCount }) {
  const drawVariants = {
    x: {
      hidden: { x2: 0, strokeOpacity: 0 },
      visible: (i) => {
        const delay = 1 + i * 0.5;
        return {
          x2: '100%',
          strokeOpacity: 1,
          transition: {
            strokeOpacity: { delay, duration: 0.01 },
            x2: { delay, bounce: 0, duration: 1.5, type: 'spring' },
          },
        };
      },
    },
    y: {
      hidden: { y2: 0, strokeOpacity: 0 },
      visible: (i) => {
        const delay = 1 + i * 0.5;
        return {
          y2: '100%',
          strokeOpacity: 1,
          transition: {
            strokeOpacity: { delay, duration: 0.01 },
            y2: { delay, bounce: 0, duration: 1.5, type: 'spring' },
          },
        };
      },
    },
  };

  const translateY = (index) =>
    strokeCount / 2 > index
      ? `translateY(calc(((${index} * var(--stroke-spacing)) + var(--stroke-spacing) / 2) * -1))`
      : `translateY(calc(((${strokeCount - (index + 1)} * var(--stroke-spacing)) + var(--stroke-spacing) / 2)))`;

  const linesX = (
    <>
      {Array.from({ length: strokeCount }, (_, index) => (
        <m.line
          key={index}
          x1="0"
          x2="100%"
          y1="50%"
          y2="50%"
          variants={drawVariants.x}
          style={{
            transform: translateY(index),
            stroke: 'var(--hero-line-stroke-color)',
            strokeDasharray: 'var(--stroke-dasharray)',
            strokeWidth: 'var(--hero-line-stroke-width)',
          }}
        />
      ))}
    </>
  );

  const translateX = (index) =>
    strokeCount / 2 > index
      ? `translateX(calc(((${index} * var(--stroke-spacing)) + var(--stroke-spacing) / 2) * -1))`
      : `translateX(calc(((${strokeCount - (index + 1)} * var(--stroke-spacing)) + var(--stroke-spacing) / 2)))`;

  const linesY = (
    <>
      {Array.from({ length: strokeCount }, (_, index) => (
        <m.line
          key={index}
          x1="50%"
          x2="50%"
          y1="0%"
          y2="100%"
          variants={drawVariants.y}
          style={{
            transform: translateX(index),
            stroke: 'var(--hero-line-stroke-color)',
            strokeDasharray: 'var(--stroke-dasharray)',
            strokeWidth: 'var(--hero-line-stroke-width)',
          }}
        />
      ))}
    </>
  );

  return (
    <>
      {linesX}
      {linesY}
    </>
  );
}

// ----------------------------------------------------------------------

export function Circles() {
  const drawCircle = {
    hidden: { opacity: 0 },
    visible: (i) => {
      const delay = 1 + i * 0.5;
      return { opacity: 1, transition: { opacity: { delay, duration: 0.01 } } };
    },
  };

  return (
    <>
      <m.path
        variants={drawCircle}
        d="M1 41C1 63.0914 18.9086 81 41 81C63.0914 81 81 63.0914 81 41C81 18.9086 63.0914 1 41 1"
        style={{
          strokeDasharray: 'var(--stroke-dasharray)',
          stroke: 'var(--hero-circle-stroke-color)',
          strokeWidth: 'var(--hero-circle-stroke-width)',
          transform: 'translate(calc(50% - 480px), calc(50% - 80px))',
        }}
      />

      <m.path
        variants={drawCircle}
        d="M1 41C1 63.0914 18.9086 81 41 81C63.0914 81 81 63.0914 81 41C81 18.9086 63.0914 1 41 1"
        style={{
          strokeDasharray: 'var(--stroke-dasharray)',
          stroke: 'var(--hero-circle-stroke-color)',
          strokeWidth: 'var(--hero-circle-stroke-width)',
          transform: 'translate(calc(50% + 400px), calc(50% + 80px))',
        }}
      />

      <m.circle
        cx="50%"
        cy="50%"
        fill="var(--hero-circle-stroke-color)"
        style={{ transform: 'translate(calc(0% - 200px), calc(0% + 200px))' }}
        initial={{ r: 0 }}
        animate={{ r: 5 }}
      />
    </>
  );
}

// ----------------------------------------------------------------------

export function PlusIcon() {
  const drawPlus = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: (i) => {
      const delay = 1 + i * 0.5;
      return {
        opacity: 1,
        pathLength: 1,
        transition: {
          opacity: { delay, duration: 0.01 },
          pathLength: { delay, bounce: 0, duration: 1.5, type: 'spring' },
        },
      };
    },
  };

  return (
    <>
      <m.path
        variants={drawPlus}
        d="M8 0V16M16 8.08889H0"
        stroke="var(--hero-plus-stroke-color)"
        style={{ transform: 'translate(calc(50% - 448px), calc(50% - 128px))' }}
      />

      <m.path
        variants={drawPlus}
        d="M8 0V16M16 8.08889H0"
        stroke="var(--hero-plus-stroke-color)"
        style={{ transform: 'translate(calc(50% + 432px), calc(50% + 192px))' }}
      />
    </>
  );
}

// ----------------------------------------------------------------------

export function Texts({ sx, ...other }) {
  return (
    <Box
      component={m.div}
      variants={varFade('in')}
      sx={[
        () => ({
          left: 0,
          width: 1,
          bottom: 0,
          height: 200,
          position: 'absolute',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
    </Box>
  );
}

// ----------------------------------------------------------------------

function Dot({ color = '#0236fc', animate, transition, sx, ...other }) {
  // Generate lighter and darker versions of the hex color
  const lighterColor = (hex) => {
    // Simple lightening algorithm - actual implementation might need adjusting
    const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 40);
    const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 40);
    const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 40);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const darkerColor = (hex) => {
    // Simple darkening algorithm
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 40);
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 40);
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 40);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const lighter = lighterColor(color);
  const darker = darkerColor(color);

  return (
    <Box
      component={m.div}
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.64, ease: [0.43, 0.13, 0.23, 0.96] } },
      }}
      sx={[
        () => ({
          width: 12,
          height: 12,
          top: '50%',
          left: '50%',
          position: 'absolute',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component={m.div}
        animate={animate}
        transition={
          transition ?? {
            duration: 6,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }
        }
        sx={[
          () => ({
            width: 1,
            height: 1,
            borderRadius: '50%',
            boxShadow: `0px -2px 4px 0px ${color} inset`,
            background: `linear-gradient(135deg, ${lighter}, ${color})`,
            '@media (prefers-color-scheme: dark)': {
              boxShadow: `0px -2px 4px 0px ${darker} inset`,
            },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      />
    </Box>
  );
}

export function Dots() {
  return (
    <>
      <Dot
        color="#947bfd"
        animate={{ x: 24 }}
        sx={{ width: 14, height: 14, transform: 'translate(calc(50% - 457px), calc(50% - 259px))' }}
      />

      <Dot
        color="#809afd"
        animate={{ y: 24 }}
        sx={{ transform: 'translate(calc(50% - 356px), calc(50% + 37px))' }}
      />

      <Dot
        color="#947bfd"
        animate={{ x: 24 }}
        sx={{ transform: 'translate(calc(50% + 332px), calc(50% + 135px))' }}
      />

      <Dot
        color="#f1e4ed"
        animate={{ x: 24 }}
        sx={{ transform: 'translate(calc(50% + 430px), calc(50% - 160px))' }}
      />

      <Dot
        color="#b3c2fe"
        animate={{ y: 24 }}
        sx={{ transform: 'translate(calc(50% + 136px), calc(50% + 332px))' }}
      />
    </>
  );
}
