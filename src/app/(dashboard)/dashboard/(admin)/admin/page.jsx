import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/db/users";
import styles from "./admin.module.css";
import StatsCard from "@/components/ui/Cards/StatsCard/StatsCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader/DashboardHeader";
import Link from "next/link";
import {
  FaCubes, FaArrowRotateLeft, FaUsers, FaMoneyBillWave,
  FaChartLine, FaFire, FaCircleExclamation, FaArrowTrendUp,
  FaArrowTrendDown, FaCircle, FaBoxOpen, FaPalette,
} from "react-icons/fa6";
import { db } from "@/lib/db";

export const metadata = {
  title: "Admin Dashboard | Hygge Rug",
  description: "Panel de administración global",
};

function formatCurrency(amount) {
  const n = parseFloat(amount || 0);
  if (n >= 100000) return `${Math.round(n / 1000)}K€`;
  return `${Math.round(n).toLocaleString('es-ES')}€`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

const STATUS_LABELS = {
  'diseñando':               { label: 'Diseñando',        color: 'var(--highlight-text)' },
  'pendiente de aprobación': { label: 'Pend. Aprobación', color: 'orange' },
  'comprobando pago':        { label: 'Comprobando Pago', color: '#f5a623' },
  'tejiendo':                { label: 'Tejiendo',         color: '#c975ff' },
  'enviado':                 { label: 'Enviado',          color: '#00bfff' },
  'recibido':                { label: 'Entregado',        color: '#00ff80' },
};

const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);
  if (!session) redirect("/auth");

  const userId = session.userId || session.user_id || session.id;
  const user = await getUserById(userId).catch(() => null);
  if (user?.rol !== 'admin') redirect("/dashboard/resumen");

  const [
    [totalRevenueRows],
    [revenueThisMonthRows],
    [revenueLastMonthRows],
    [monthlyRevenueRows],
    [ordersByStatusRows],
    [avgOrderRows],
    [newUsersRows],
    [urgentOrdersRows],
    [topProductsRows],
    [pendingReturnsRows],
    [totalUsersRows],
  ] = await Promise.all([
    db.query(`SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE order_status = 'recibido'`),
    db.query(`SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE order_status = 'recibido' AND creation_date >= DATE_FORMAT(NOW(), '%Y-%m-01')`),
    db.query(`SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE order_status = 'recibido' AND creation_date >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01') AND creation_date < DATE_FORMAT(NOW(), '%Y-%m-01')`),
    db.query(`SELECT DATE_FORMAT(creation_date, '%Y-%m') AS month, COALESCE(SUM(total_amount), 0) AS revenue FROM orders WHERE order_status = 'recibido' AND creation_date >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 5 MONTH) GROUP BY DATE_FORMAT(creation_date, '%Y-%m') ORDER BY month ASC`),
    db.query(`SELECT order_status, COUNT(*) AS count FROM orders WHERE order_status != 'en_carrito' GROUP BY order_status`),
    db.query(`SELECT COALESCE(AVG(total_amount), 0) AS avg FROM orders WHERE order_status NOT IN ('en_carrito', 'diseñando') AND total_amount > 0`),
    db.query(`SELECT COUNT(*) AS count FROM users WHERE creation_date >= DATE_FORMAT(NOW(), '%Y-%m-01')`),
    db.query(`SELECT o.order_id, o.total_amount, o.creation_date, o.order_status, u.nickname FROM orders o JOIN users u ON o.user_id = u.user_id WHERE o.order_status IN ('pendiente de aprobación', 'comprobando pago') ORDER BY o.creation_date ASC LIMIT 6`),
    db.query(`SELECT p.name, p.image_url, COALESCE(SUM(op.quantity), 0) AS total_qty FROM order_product op JOIN products p ON op.product_id = p.product_id JOIN orders o ON op.order_id = o.order_id WHERE o.order_status NOT IN ('en_carrito') GROUP BY p.product_id, p.name, p.image_url ORDER BY total_qty DESC LIMIT 5`),
    db.query(`SELECT COUNT(*) AS count FROM order_returns WHERE status = 'pendiente'`),
    db.query(`SELECT COUNT(*) AS count FROM users`),
  ]);

  // Métricas derivadas
  const totalRevenue    = parseFloat(totalRevenueRows[0]?.total || 0);
  const revenueThisMonth = parseFloat(revenueThisMonthRows[0]?.total || 0);
  const revenueLastMonth = parseFloat(revenueLastMonthRows[0]?.total || 0);
  const avgOrder        = parseFloat(avgOrderRows[0]?.avg || 0);
  const newUsers        = newUsersRows[0]?.count || 0;
  const pendingReturns  = pendingReturnsRows[0]?.count || 0;
  const totalUsers      = totalUsersRows[0]?.count || 0;

  const momChange   = revenueLastMonth > 0
    ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100).toFixed(1)
    : null;
  const momPositive = revenueThisMonth >= revenueLastMonth;

  // Mapa de estados
  const statusMap = Object.fromEntries(ordersByStatusRows.map(r => [r.order_status, Number(r.count)]));
  const urgentCount      = (statusMap['pendiente de aprobación'] || 0) + (statusMap['comprobando pago'] || 0);
  const inProductionCount = statusMap['tejiendo'] || 0;
  const totalOrdersAll   = Object.values(statusMap).reduce((a, b) => a + b, 0) || 1;

  // Datos del gráfico de barras (últimos 6 meses)
  const now = new Date();
  const chartMonths = Array.from({ length: 6 }, (_, i) => {
    const d   = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const found = monthlyRevenueRows.find(r => r.month === key);
    return {
      key,
      label:      MONTH_NAMES[d.getMonth()],
      revenue:    found ? parseFloat(found.revenue) : 0,
      isCurrent:  i === 5,
    };
  });
  const maxRevenue = Math.max(...chartMonths.map(m => m.revenue), 1);

  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader
        user={user}
        session={session}
        isAdmin={true}
        description="Visión global del negocio en tiempo real."
      />

      {/* ── KPIs ── */}
      <div className={styles.kpiGrid}>
        <StatsCard
          bigText={formatCurrency(totalRevenue)}
          smallText="Ingresos Totales"
          color="#00ff80"
          Icon={FaMoneyBillWave}
        />
        <StatsCard
          bigText={formatCurrency(revenueThisMonth)}
          smallText="Ingresos Este Mes"
          color="var(--highlight-text)"
          Icon={FaChartLine}
        />
        <StatsCard
          bigText={urgentCount}
          smallText="Requieren Atención"
          color="orange"
          Icon={FaCircleExclamation}
        />
        <StatsCard
          bigText={inProductionCount}
          smallText="En Producción"
          color="#c975ff"
          Icon={FaCubes}
        />
        <StatsCard
          bigText={formatCurrency(avgOrder)}
          smallText="Ticket Medio"
          color="var(--hover-text)"
          Icon={FaFire}
        />
        <StatsCard
          bigText={newUsers}
          smallText="Nuevos Clientes/Mes"
          color="var(--button-before-hover)"
          Icon={FaUsers}
        />
      </div>

      {/* ── GRÁFICO + PIPELINE ── */}
      <div className={styles.chartsRow}>

        {/* Gráfico de barras mensual */}
        <div className={styles.chartCard}>
          <div className={styles.chartCardHeader}>
            <h3 className={styles.sectionLabel}>Ingresos Últimos 6 Meses</h3>
            {momChange !== null && (
              <span className={`${styles.momBadge} ${momPositive ? styles.momPos : styles.momNeg}`}>
                {momPositive ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                {Math.abs(momChange)}% vs mes anterior
              </span>
            )}
          </div>
          <div className={styles.barChart}>
            {chartMonths.map((m) => {
              const pct = (m.revenue / maxRevenue) * 100;
              return (
                <div key={m.key} className={styles.barCol}>
                  <span className={styles.barAmount}>
                    {m.revenue > 0 ? formatCurrency(m.revenue) : ''}
                  </span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${m.isCurrent ? styles.barFillCurrent : ''}`}
                      style={{ height: `${Math.max(pct, m.revenue > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                  <span className={`${styles.barLabel} ${m.isCurrent ? styles.barLabelCurrent : ''}`}>
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline de pedidos por estado */}
        <div className={styles.pipelineCard}>
          <h3 className={styles.sectionLabel}>Pipeline de Pedidos</h3>
          <div className={styles.pipelineList}>
            {Object.entries(STATUS_LABELS).map(([status, cfg]) => {
              const count = statusMap[status] || 0;
              const pct   = Math.round((count / totalOrdersAll) * 100);
              return (
                <div key={status} className={styles.pipelineRow}>
                  <div className={styles.pipelineLabelGroup}>
                    <FaCircle style={{ color: cfg.color, fontSize: '0.45rem', flexShrink: 0 }} />
                    <span className={styles.pipelineName}>{cfg.label}</span>
                  </div>
                  <div className={styles.pipelineBarTrack}>
                    <div
                      className={styles.pipelineBarFill}
                      style={{ width: `${pct}%`, background: cfg.color }}
                    />
                  </div>
                  <span className={styles.pipelineCount}>{count}</span>
                </div>
              );
            })}
          </div>
          <div className={styles.pipelineFooter}>
            <div className={styles.pipelineFooterStat}>
              <span className={styles.pipelineFooterVal}>{totalUsers}</span>
              <span className={styles.pipelineFooterLbl}>Usuarios</span>
            </div>
            <div className={styles.pipelineFooterDivider} />
            <div className={styles.pipelineFooterStat}>
              <span className={styles.pipelineFooterVal}>{pendingReturns}</span>
              <span className={styles.pipelineFooterLbl}>Devoluciones pend.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PEDIDOS URGENTES + TOP PRODUCTOS ── */}
      <div className={styles.bottomRow}>

        {/* Pedidos urgentes */}
        <div className={styles.bottomCard}>
          <div className={styles.bottomCardHeader}>
            <h3 className={styles.sectionLabel}>Pedidos que Requieren Acción</h3>
            <Link href="/dashboard/admin/pedidos" className={styles.seeAllLink}>
              Ver todos →
            </Link>
          </div>
          {urgentOrdersRows.length === 0 ? (
            <div className={styles.emptyState}>
              <FaBoxOpen className={styles.emptyIcon} />
              <p>No hay pedidos urgentes</p>
            </div>
          ) : (
            <div className={styles.urgentList}>
              {urgentOrdersRows.map(order => {
                const cfg = STATUS_LABELS[order.order_status] || { label: order.order_status, color: '#888' };
                return (
                  <Link
                    key={order.order_id}
                    href={`/dashboard/admin/pedidos/${order.order_id}`}
                    className={styles.urgentItem}
                  >
                    <span className={styles.urgentId}>#{order.order_id}</span>
                    <span className={styles.urgentNick}>{order.nickname}</span>
                    <span className={styles.urgentStatus} style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                    <span className={styles.urgentDate}>{formatDate(order.creation_date)}</span>
                    <span className={styles.urgentAmount}>{formatCurrency(order.total_amount)}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Top productos */}
        <div className={styles.bottomCard}>
          <div className={styles.bottomCardHeader}>
            <h3 className={styles.sectionLabel}>Productos Más Vendidos</h3>
            <Link href="/dashboard/admin/productos" className={styles.seeAllLink}>
              Ver catálogo →
            </Link>
          </div>
          {topProductsRows.length === 0 ? (
            <div className={styles.emptyState}>
              <FaPalette className={styles.emptyIcon} />
              <p>Sin datos de ventas aún</p>
            </div>
          ) : (
            <div className={styles.topList}>
              {topProductsRows.map((product, idx) => (
                <div key={idx} className={styles.topItem}>
                  <span className={styles.topRank}>#{idx + 1}</span>
                  <div className={styles.topThumb}>
                    {product.image_url
                      ? <img src={product.image_url} alt={product.name} />
                      : <FaPalette />}
                  </div>
                  <div className={styles.topInfo}>
                    <span className={styles.topName}>{product.name}</span>
                    <span className={styles.topQty}>{product.total_qty} uds. vendidas</span>
                  </div>
                  <div className={styles.topBar}>
                    <div
                      className={styles.topBarFill}
                      style={{ width: `${(product.total_qty / topProductsRows[0].total_qty) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
