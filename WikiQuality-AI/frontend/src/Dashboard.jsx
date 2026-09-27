import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  FileText,
  History,
  Home,
  LogOut,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
  AlertCircle,
} from "lucide-react";
import "./Dashboard.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [articleText, setArticleText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [systemStatus, setSystemStatus] = useState("Checking...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("wikiquality_user");
    const token = localStorage.getItem("wikiquality_token");

    if (!storedUser || !token) {
      window.location.href = "/";
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "user") {
        window.location.href = "/admin";
        return;
      }

      setUser(parsedUser);
    } catch {
      localStorage.removeItem("wikiquality_user");
      localStorage.removeItem("wikiquality_token");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    const loadSystemData = async () => {
      try {
        const healthResponse = await fetch(
          `${API_BASE_URL}/api/health`
        );

        if (healthResponse.ok) {
          setSystemStatus("Operational");
        } else {
          setSystemStatus("Unavailable");
        }
      } catch {
        setSystemStatus("Unavailable");
      }

      try {
        const datasetResponse = await fetch(
          `${API_BASE_URL}/api/ml/dataset-quality`
        );

        if (datasetResponse.ok) {
          const data = await datasetResponse.json();
          setDatasetInfo(data);
        }
      } catch {
        setDatasetInfo(null);
      }
    };

    loadSystemData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("wikiquality_token");
    localStorage.removeItem("wikiquality_user");

    window.location.href = "/";
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();

    setError("");
    setAnalysisResult(null);

    if (!articleText.trim()) {
      setError(
        "Please enter article text before starting the analysis."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/analyze/quality-features`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: articleText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Article analysis failed."
        );
      }

      setAnalysisResult(data);
    } catch (analysisError) {
      setError(
        analysisError.message ||
          "Unable to connect to the analysis service."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="dashboard-loading">
        <Brain size={30} />
        <p>Loading WikiQuality AI...</p>
      </div>
    );
  }

  const qualityAnalysis = analysisResult?.quality_analysis;
  const summary = qualityAnalysis?.summary;

  const structureAnalysis =
    analysisResult?.structure_analysis || {};
  const structureStats =
    structureAnalysis?.statistics || {};

  const nlpAnalysis =
    analysisResult?.nlp_analysis || {};

  const semanticAnalysis =
    analysisResult?.semantic_analysis || {};

  const informationAnalysis =
    analysisResult?.information_analysis || {};

  const entityAnalysis =
    analysisResult?.entity_analysis || {};

  const topicAnalysis =
    analysisResult?.topic_coverage_analysis || {};

  const citationAnalysis =
    analysisResult?.citation_analysis || {};

  const aiExplanation =
    analysisResult?.ai_explanation?.explanation ||
    analysisResult?.ai_explanation ||
    {};

  const evidence =
    Array.isArray(analysisResult?.evidence)
      ? analysisResult.evidence
      : [];

  return (
    <div className="dashboard-page">

      {/* =========================
          SIDEBAR
          ========================= */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Brain size={23} />
          </div>

          <div>
            <strong>
              WikiQuality <span>AI</span>
            </strong>

            <small>
              Knowledge Quality Platform
            </small>
          </div>
        </div>

        <nav className="sidebar-nav">

          <button className="sidebar-nav-item active">
            <Home size={18} />
            <span>Dashboard</span>
          </button>

          <button className="sidebar-nav-item">
            <Search size={18} />
            <span>Analyze Article</span>
          </button>

          <button className="sidebar-nav-item">
            <History size={18} />
            <span>Analysis History</span>
          </button>

          <button className="sidebar-nav-item">
            <BarChart3 size={18} />
            <span>Compare Articles</span>
          </button>

          <button className="sidebar-nav-item">
            <Network size={18} />
            <span>Knowledge Graph</span>
          </button>

          <button className="sidebar-nav-item">
            <FileText size={18} />
            <span>Reports</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="sidebar-user-avatar">
              <UserRound size={18} />
            </div>

            <div>
              <strong>{user.name}</strong>
              <span>User</span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* =========================
          MAIN DASHBOARD
          ========================= */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              USER DASHBOARD
            </p>

            <h1>
              Welcome back,{" "}
              {user.name.split(" ")[0]} 👋
            </h1>

            <p className="dashboard-subtitle">
              Analyze Wikipedia knowledge quality using NLP,
              semantic analysis and evidence-based metrics.
            </p>

          </div>

          <div className="header-user">

            <div className="header-user-avatar">
              <UserRound size={20} />
            </div>

            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>

          </div>

        </header>

        {/* =========================
            TOP STATISTICS
            ========================= */}

        <section className="stat-grid">

          <div className="stat-card">

            <div className="stat-icon blue">
              <BookOpen size={21} />
            </div>

            <div>
              <span>Dataset Articles</span>

              <strong>
                {datasetInfo?.total_articles ?? "—"}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon purple">
              <Brain size={21} />
            </div>

            <div>
              <span>Quality Classes</span>

              <strong>
                {datasetInfo?.represented_classes?.length ?? "—"}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Analysis Engine</span>

              <strong>
                {systemStatus}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange">
              <ShieldCheck size={21} />
            </div>

            <div>
              <span>Your Role</span>
              <strong>User</strong>
            </div>

          </div>

        </section>

        {/* =========================
            ANALYSIS INPUT
            ========================= */}

        <section className="dashboard-grid">

          <div className="analysis-card">

            <div className="section-heading">

              <div>

                <div className="section-icon">
                  <Sparkles size={19} />
                </div>

                <div>
                  <h2>Analyze an Article</h2>

                  <p>
                    Paste article text to run the
                    WikiQuality AI quality pipeline.
                  </p>
                </div>

              </div>

              <span className="live-badge">
                <span></span>
                Live API
              </span>

            </div>

            <form onSubmit={handleAnalyze}>

              <label htmlFor="article-text">
                Article content
              </label>

              <textarea
                id="article-text"
                value={articleText}
                onChange={(event) =>
                  setArticleText(event.target.value)
                }
                placeholder={`Paste Wikipedia article text here...

Example:
Mangaluru is a major city in Karnataka, India.

History
Mangaluru has a long history...

Geography
The city is located on the western coast...`}
                rows={10}
                disabled={loading}
              />

              {error && (
                <div className="analysis-error">
                  <AlertCircle size={17} />
                  <span>{error}</span>
                </div>
              )}

              <div className="analysis-actions">

                <div className="input-hint">
                  <FileText size={15} />

                  <span>
                    NLP • Semantic • Information • Entity •
                    Citation analysis
                  </span>
                </div>

                <button
                  type="submit"
                  className="analyze-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />
                      Analyze Article
                      <ChevronRight size={17} />
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

          {/* QUICK ACTIONS */}

          <div className="quick-actions-card">

            <div className="section-heading simple">

              <div>
                <h2>Quick Actions</h2>
                <p>
                  Choose another analysis source.
                </p>
              </div>

            </div>

            <button className="quick-action">

              <div className="quick-action-icon">
                <Search size={19} />
              </div>

              <div>
                <strong>Wikipedia Search</strong>
                <span>
                  Find and analyze an article
                </span>
              </div>

              <ChevronRight size={17} />

            </button>

            <button className="quick-action">

              <div className="quick-action-icon">
                <Upload size={19} />
              </div>

              <div>
                <strong>Upload PDF</strong>
                <span>
                  Analyze a PDF document
                </span>
              </div>

              <ChevronRight size={17} />

            </button>

            <button className="quick-action">

              <div className="quick-action-icon">
                <FileText size={19} />
              </div>

              <div>
                <strong>Upload TXT</strong>
                <span>
                  Analyze a text document
                </span>
              </div>

              <ChevronRight size={17} />

            </button>

            <button className="quick-action">

              <div className="quick-action-icon">
                <Network size={19} />
              </div>

              <div>
                <strong>Knowledge Graph</strong>
                <span>
                  Explore article relationships
                </span>
              </div>

              <ChevronRight size={17} />

            </button>

          </div>

        </section>

        {/* =========================
            RESULTS
            ========================= */}

        {analysisResult && (

          <section className="results-card">

            {/* RESULT HEADER */}

            <div className="results-heading">

              <div>

                <p className="dashboard-eyebrow">
                  ANALYSIS COMPLETE
                </p>

                <h2>
                  Quality Analysis Results
                </h2>

              </div>

              <div className="result-success">
                <CheckCircle2 size={17} />
                Completed
              </div>

            </div>

            {/* =========================
                SUMMARY STATS
                ========================= */}

            <div className="result-stat-grid">

              <div className="result-stat">
                <span>Total Findings</span>

                <strong>
                  {summary?.total_findings ?? 0}
                </strong>
              </div>

              <div className="result-stat">
                <span>High Findings</span>

                <strong>
                  {summary?.high_findings ?? 0}
                </strong>
              </div>

              <div className="result-stat">
                <span>Medium Findings</span>

                <strong>
                  {summary?.medium_findings ?? 0}
                </strong>
              </div>

              <div className="result-stat">
                <span>Strengths</span>

                <strong>
                  {summary?.total_strengths ?? 0}
                </strong>
              </div>

            </div>

            {/* =========================
                DETAILED ANALYSIS
                IMPORTANT:
                THIS IS OUTSIDE result-stat-grid
                ========================= */}

            <div className="detailed-analysis-grid">

              {/* STRUCTURE */}

              <div className="detail-analysis-card">

                <div className="detail-card-heading">

                  <FileText size={17} />

                  <div>
                    <h3>
                      Structure Analysis
                    </h3>

                    <p>
                      Article organization and length
                    </p>
                  </div>

                </div>

                <div className="metric-grid">

                  <div className="metric-item">
                    <span>Words</span>
                    <strong>
                      {structureStats.word_count ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Sentences</span>
                    <strong>
                      {structureStats.sentence_count ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Sections</span>
                    <strong>
                      {structureStats.section_count ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Paragraphs</span>
                    <strong>
                      {structureStats.paragraph_count ?? 0}
                    </strong>
                  </div>

                </div>

              </div>

              {/* NLP */}

              <div className="detail-analysis-card">

                <div className="detail-card-heading">

                  <Brain size={17} />

                  <div>
                    <h3>NLP Analysis</h3>
                    <p>
                      Vocabulary and repetition
                    </p>
                  </div>

                </div>

                <div className="metric-grid">

                  <div className="metric-item">
                    <span>Vocabulary Diversity</span>

                    <strong>
                      {nlpAnalysis.vocabulary_diversity ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Repetition Ratio</span>

                    <strong>
                      {nlpAnalysis.repetition_ratio ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Content Word Ratio</span>

                    <strong>
                      {nlpAnalysis.content_word_ratio ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Unique Words</span>

                    <strong>
                      {nlpAnalysis.unique_word_count ?? 0}
                    </strong>
                  </div>

                </div>

              </div>

              {/* SEMANTIC */}

              <div className="detail-analysis-card">

                <div className="detail-card-heading">

                  <Sparkles size={17} />

                  <div>
                    <h3>
                      Semantic Analysis
                    </h3>

                    <p>
                      Meaning similarity and redundancy
                    </p>
                  </div>

                </div>

                <div className="metric-grid">

                  <div className="metric-item">
                    <span>Average Similarity</span>

                    <strong>
                      {semanticAnalysis.average_similarity ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Redundancy Ratio</span>

                    <strong>
                      {semanticAnalysis.semantic_redundancy_ratio ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>High Similarity Pairs</span>

                    <strong>
                      {semanticAnalysis.high_similarity_pairs?.length ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Sentences</span>

                    <strong>
                      {semanticAnalysis.sentence_count ?? 0}
                    </strong>
                  </div>

                </div>

              </div>

              {/* INFORMATION DIVERSITY */}

              <div className="detail-analysis-card">

                <div className="detail-card-heading">

                  <BarChart3 size={17} />

                  <div>
                    <h3>
                      Information Diversity
                    </h3>

                    <p>
                      Content breadth and dimensions
                    </p>
                  </div>

                </div>

                <div className="metric-grid">

                  <div className="metric-item">
                    <span>Information Diversity</span>

                    <strong>
                      {informationAnalysis.information_diversity ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Lexical Diversity</span>

                    <strong>
                      {informationAnalysis.lexical_diversity ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Topic Count</span>

                    <strong>
                      {informationAnalysis.topic_count ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Dimensions</span>

                    <strong>
                      {informationAnalysis.information_dimension_count ?? 0}
                    </strong>
                  </div>

                </div>

              </div>

              {/* TOPIC COVERAGE */}

              <div className="detail-analysis-card">

                <div className="detail-card-heading">

                  <Network size={17} />

                  <div>
                    <h3>
                      Topic Coverage
                    </h3>

                    <p>
                      Detected knowledge dimensions
                    </p>
                  </div>

                </div>

                <div className="metric-grid">

                  <div className="metric-item">
                    <span>Covered Topics</span>

                    <strong>
                      {topicAnalysis.covered_topic_count ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Possible Topics</span>

                    <strong>
                      {topicAnalysis.total_possible_topics ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Coverage Ratio</span>

                    <strong>
                      {topicAnalysis.topic_coverage_ratio ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Coverage Level</span>

                    <strong className="metric-text">
                      {topicAnalysis.coverage_level || "N/A"}
                    </strong>
                  </div>

                </div>

              </div>

              {/* ENTITY ANALYSIS */}

              <div className="detail-analysis-card">

                <div className="detail-card-heading">

                  <UserRound size={17} />

                  <div>
                    <h3>
                      Entity Analysis
                    </h3>

                    <p>
                      Named entities detected by NLP
                    </p>
                  </div>

                </div>

                <div className="metric-grid">

                  <div className="metric-item">
                    <span>Total Mentions</span>

                    <strong>
                      {entityAnalysis.total_entity_mentions ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Unique Entities</span>

                    <strong>
                      {entityAnalysis.unique_entity_count ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Entity Types</span>

                    <strong>
                      {entityAnalysis.entity_type_count ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Entity Diversity</span>

                    <strong>
                      {entityAnalysis.entity_diversity ?? 0}
                    </strong>
                  </div>

                </div>

              </div>

              {/* CITATIONS */}

              <div className="detail-analysis-card">

                <div className="detail-card-heading">

                  <FileText size={17} />

                  <div>
                    <h3>
                      Citation & Evidence
                    </h3>

                    <p>
                      Evidence signals detected
                    </p>
                  </div>

                </div>

                <div className="metric-grid">

                  <div className="metric-item">
                    <span>Citation Markers</span>

                    <strong>
                      {citationAnalysis.citation_marker_count ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Citation Needed</span>

                    <strong>
                      {citationAnalysis.citation_needed_count ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>URLs</span>

                    <strong>
                      {citationAnalysis.url_count ?? 0}
                    </strong>
                  </div>

                  <div className="metric-item">
                    <span>Evidence Signals</span>

                    <strong>
                      {citationAnalysis.evidence_signal_count ?? 0}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

            {/* =========================
                STRENGTHS
                ========================= */}

            {qualityAnalysis?.strengths?.length > 0 && (

              <div className="result-section">

                <h3>
                  <CheckCircle2 size={17} />
                  Detected Strengths
                </h3>

                <div className="result-list">

                  {qualityAnalysis.strengths
                    .slice(0, 4)
                    .map((strength, index) => (

                      <div
                        className="result-item positive"
                        key={`strength-${index}`}
                      >

                        <CheckCircle2 size={15} />

                        <span>
                          {typeof strength === "string"
                            ? strength
                            : strength.message ||
                              strength.description ||
                              JSON.stringify(strength)}
                        </span>

                      </div>

                    ))}

                </div>

              </div>

            )}

            {/* =========================
                FINDINGS
                ========================= */}

            {qualityAnalysis?.findings?.length > 0 && (

              <div className="result-section">

                <h3>
                  <AlertCircle size={17} />
                  Findings Requiring Review
                </h3>

                <div className="result-list">

                  {qualityAnalysis.findings
                    .slice(0, 5)
                    .map((finding, index) => (

                      <div
                        className="result-item finding"
                        key={`finding-${index}`}
                      >

                        <AlertCircle size={15} />

                        <span>
                          {finding.message ||
                            finding.description ||
                            JSON.stringify(finding)}
                        </span>

                      </div>

                    ))}

                </div>

              </div>

            )}

            {/* =========================
                AI EXPLANATION
                ========================= */}

            {aiExplanation &&
              Object.keys(aiExplanation).length > 0 && (

              <div className="ai-explanation-panel">

                <div className="detail-card-heading">

                  <Sparkles size={18} />

                  <div>
                    <h3>
                      AI Explanation
                    </h3>

                    <p>
                      Evidence-grounded interpretation
                    </p>
                  </div>

                </div>

                {aiExplanation.headline && (
                  <h4 className="ai-headline">
                    {aiExplanation.headline}
                  </h4>
                )}

                {aiExplanation.summary && (
                  <p className="ai-summary">
                    {aiExplanation.summary}
                  </p>
                )}

                {aiExplanation.concerns?.length > 0 && (

                  <div className="ai-subsection">

                    <h4>
                      Areas Requiring Attention
                    </h4>

                    {aiExplanation.concerns.map(
                      (item, index) => (

                        <div
                          className="ai-list-item concern"
                          key={index}
                        >

                          <AlertCircle size={15} />

                          <span>
                            {typeof item === "string"
                              ? item
                              : item.message ||
                                item.description ||
                                JSON.stringify(item)}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}

                {aiExplanation.improvement_suggestions?.length > 0 && (

                  <div className="ai-subsection">

                    <h4>
                      Improvement Suggestions
                    </h4>

                    {aiExplanation.improvement_suggestions.map(
                      (item, index) => (

                        <div
                          className="ai-list-item suggestion"
                          key={index}
                        >

                          <CheckCircle2 size={15} />

                          <span>
                            {typeof item === "string"
                              ? item
                              : item.message ||
                                item.description ||
                                JSON.stringify(item)}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

            {/* =========================
                EVIDENCE
                ========================= */}

            {evidence.length > 0 && (

              <div className="evidence-panel">

                <div className="detail-card-heading">

                  <ShieldCheck size={18} />

                  <div>
                    <h3>
                      Analysis Evidence
                    </h3>

                    <p>
                      Measurements supporting the analysis
                    </p>
                  </div>

                </div>

                <div className="evidence-list">

                  {evidence.map((item, index) => (

                    <div
                      className="evidence-item"
                      key={index}
                    >

                      <CheckCircle2 size={15} />

                      <div>

                        <strong>
                          {item.title ||
                            item.metric ||
                            item.category ||
                            "Evidence"}
                        </strong>

                        <p>
                          {item.message ||
                            item.description ||
                            item.detail ||
                            JSON.stringify(item)}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </section>

        )}

        {/* =========================
            BOTTOM SECTION
            ========================= */}

        <section className="bottom-grid">

          <div className="history-card">

            <div className="section-heading simple">

              <div>
                <h2>Recent Analyses</h2>

                <p>
                  Your latest article analysis activity.
                </p>
              </div>

              <button className="text-button">
                View all
              </button>

            </div>

            <div className="empty-history">

              <div className="empty-icon">
                <History size={23} />
              </div>

              <h3>
                No analysis history yet
              </h3>

              <p>
                Your completed analyses will appear here.
              </p>

            </div>

          </div>

          <div className="system-card">

            <div className="section-heading simple">

              <div>
                <h2>System Status</h2>

                <p>
                  Current WikiQuality AI services.
                </p>
              </div>

            </div>

            <div className="system-row">

              <span>
                <span className="status-dot"></span>
                FastAPI Backend
              </span>

              <strong>
                {systemStatus}
              </strong>

            </div>

            <div className="system-row">

              <span>
                <span className="status-dot"></span>
                NLP Analysis
              </span>

              <strong>
                Available
              </strong>

            </div>

            <div className="system-row">

              <span>
                <span className="status-dot"></span>
                Semantic Analysis
              </span>

              <strong>
                Available
              </strong>

            </div>

            <div className="system-row">

              <span>
                <span className="status-dot"></span>
                Dataset
              </span>

              <strong>
                {datasetInfo?.training_ready
                  ? "Ready"
                  : "Prototype"}
              </strong>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;