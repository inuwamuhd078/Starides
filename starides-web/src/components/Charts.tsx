import React from 'react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// --- Types ---
interface ChartDataPoint {
    name: string;
    value: number;
    [key: string]: any;
}

interface BaseChartProps {
    title: string;
    data: ChartDataPoint[];
    color?: string;
    height?: number;
    className?: string;
}

// --- Common Tooltip Style ---
const tooltipStyle = {
    backgroundColor: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)',
    color: 'var(--color-text-primary)'
};

// --- Components ---

export const AreaChartCard: React.FC<BaseChartProps> = ({ title, data, color = '#8b5cf6', height = 300, className = '' }) => {
    return (
        <div className={`chart-card ${className}`} style={{ background: 'var(--color-bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-border-light)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</h3>
            <div style={{ width: '100%', height }}>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} tickFormatter={(value) => `${value >= 1000 ? value / 1000 + 'k' : value}`} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#color-${title})`} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const BarChartCard: React.FC<BaseChartProps> = ({ title, data, color = '#3b82f6', height = 300, className = '' }) => {
    return (
        <div className={`chart-card ${className}`} style={{ background: 'var(--color-bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-border-light)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</h3>
            <div style={{ width: '100%', height }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                        <Tooltip cursor={{ fill: 'var(--color-bg-tertiary)', opacity: 0.5 }} contentStyle={tooltipStyle} />
                        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const PieChartCard: React.FC<BaseChartProps & { colors?: string[] }> = ({ title, data, colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'], height = 300, className = '' }) => {
    return (
        <div className={`chart-card ${className}`} style={{ background: 'var(--color-bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-border-light)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</h3>
            <div style={{ width: '100%', height }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
