const { createApp, computed } = Vue;

const PROHIBITED_REGEX = /[|;:\/\\\[\]{}]/g; // | ; : / \ [ ] { } (para replace)
const PROHIBITED_TEST = /[|;:\/\\\[\]{}]/; // versão sem flag global (para test)

createApp({
  data() {
    return {
      activeCompany: 'nitro',
      activeTab: 'campanhas',
      isDarkMode: true, // Começa no modo dark
      redes: ["Google", "Facebook", "TikTok"],
      posicionamentos: ["YT", "Display", "Search"],
      redeTrafegoOpts: [
        { label: 'Facebook', value: 'FB' },
        { label: 'Google', value: 'Google' },
        { label: 'TikTok', value: 'TTK' },
      ],
      showBrackets: true,
      form: {
        siglaGestor: "",
        rede: "Google",
        posicionamento: "YT",
        oferta: "",
        pais: "USA",
        estrutura: "",
        dataDiaUm: "",
        dataDiaUmRaw: "",
        bm: "",
        ca: "",
        nomeCampanha: "",
        adNumCampaign: "",
      },
      formAds: {
        sequencia: null,
        copy: "",
        redeTrafego: "FB",
        oferta: "",
        adNum: "",
        variacao: "",
        hook: "",
        avatar: "",
        avatarTipo: "S", // S = não famoso, F = famoso
        editor: "",
      },
      formNeomoonCampaign: {
        siglaGestor: "",
        rede: "Google",
        posicionamento: "YT",
        bm: "",
        ca: "",
        oferta: "",
        funil: "",
        funilOutro: "",
        pais: "US",
        adNumCampaign: "",
        estrutura: "",
        estrategiaLance: "",
        nomeCampanha: "",
        dataDiaUmRaw: "",
      },
      formNeomoonAds: {
        sequencia: null,
        copy: "",
        copyOutro: "",
        redeTrafego: "FB",
        oferta: "",
        adNum: "",
        angulo: "",
        hook: "",
        avatar: "",
        avatarTipo: "IA",
        tipoArquivo: "",
        formato: "",
        editor: "",
        editorOutro: "",
      },
      copied: false,
    };
  },
  computed: {
    isValid() {
      // Validação baseada na rede selecionada
      let requiredFilled;
      let combined;
      
      if (this.form.rede === 'Facebook') {
        // Facebook: BM é obrigatório, posicionamento não
        requiredFilled = this.form.siglaGestor && this.form.rede && this.form.bm && this.form.ca && this.form.oferta && this.form.pais && this.form.nomeCampanha && this.form.dataDiaUmRaw;
        combined = `${this.form.siglaGestor}${this.form.bm}${this.form.ca}${this.form.oferta}${this.form.pais}${this.form.nomeCampanha}`;
      } else if (this.form.rede === 'Google') {
        // Google: Posicionamento é obrigatório, BM não
        requiredFilled = this.form.siglaGestor && this.form.rede && this.form.posicionamento && this.form.ca && this.form.oferta && this.form.pais && this.form.nomeCampanha && this.form.dataDiaUmRaw;
        combined = `${this.form.siglaGestor}${this.form.posicionamento}${this.form.ca}${this.form.oferta}${this.form.pais}${this.form.nomeCampanha}`;
      } else if (this.form.rede === 'TikTok') {
        // TikTok: não exige preenchimento manual de posicionamento (fixo N/A)
        requiredFilled = this.form.siglaGestor && this.form.rede && this.form.ca && this.form.oferta && this.form.pais && this.form.nomeCampanha && this.form.dataDiaUmRaw;
        combined = `${this.form.siglaGestor}TTK${this.form.ca}${this.form.oferta}${this.form.pais}${this.form.nomeCampanha}`;
      }
      
      const noProhibited = !PROHIBITED_TEST.test(combined);
      const adOk = this.form.adNumCampaign && this.form.adNumCampaign.trim().length > 0;
      return Boolean(requiredFilled && noProhibited && adOk);
    },
    // Preview Campanhas conforme especificação
    preview() {
      // Função para limpar espaços e hífens
      const cleanValue = (value) => {
        return String(value || "").replace(/[\s-]/g, "").toUpperCase();
      };
      
      // Função especial para estrutura que preserva hífens
      const cleanValueKeepHyphens = (value) => {
        return String(value || "").replace(/\s/g, "").toUpperCase();
      };
      
      const adToken = cleanValue(this.form.adNumCampaign);
      const withToken = (value) => {
        const val = cleanValue(value);
        return val ? `[${val}]` : "";
      };
      
      const withTokenKeepHyphens = (value) => {
        const val = cleanValueKeepHyphens(value);
        return val ? `[${val}]` : "";
      };
      const formatDate = (iso) => {
        if (!iso) return "";
        const [y,m,d] = iso.split('-');
        if (!y || !m || !d) return "";
        return `${d}/${m}/${y}`;
      };
      
      // Determina o formato baseado na rede
      if (this.form.rede === 'Facebook') {
        // Padrão Facebook: [GESTOR][REDE DE TRÁFEGO][BM][CA][OFERTA][PAÍS][AD][ESTRUTURA][NOME DA CAMPANHA][DATA DO DIA 1 DA CAMPANHA]
        const parts = [
          withToken(this.form.siglaGestor), // [GESTOR]
          withToken("FB"),                  // [REDE DE TRÁFEGO] - sempre FB para Facebook
          withToken(this.form.bm),          // [BM]
          withToken(this.form.ca),          // [CA]
          withToken(this.form.oferta),      // [OFERTA]
          withToken(this.form.pais),        // [PAÍS]
          withToken(adToken),               // [AD]
          withTokenKeepHyphens(this.form.estrutura),   // [ESTRUTURA]
          withToken(this.form.nomeCampanha), // [NOME DA CAMPANHA]
          withToken(formatDate(this.form.dataDiaUmRaw)), // [DATA DO DIA 1]
        ];
        return parts.join("");
      } else if (this.form.rede === 'Google') {
        // Padrão Google: [GESTOR][REDE DE TRÁFEGO][POSICIONAMENTO][CA][OFERTA][PAÍS][AD][ESTRUTURA][NOME DA CAMPANHA][DATA DO DIA 1 DA CAMPANHA]
        const parts = [
          withToken(this.form.siglaGestor), // [GESTOR]
          withToken("Google"),              // [REDE DE TRÁFEGO] - sempre Google
          withToken(this.form.posicionamento), // [POSICIONAMENTO]
          withToken(this.form.ca),          // [CA]
          withToken(this.form.oferta),      // [OFERTA]
          withToken(this.form.pais),        // [PAÍS]
          withToken(adToken),               // [AD]
          withTokenKeepHyphens(this.form.estrutura),   // [ESTRUTURA]
          withToken(this.form.nomeCampanha), // [NOME DA CAMPANHA]
          withToken(formatDate(this.form.dataDiaUmRaw)), // [DATA DO DIA 1]
        ];
        return parts.join("");
      } else if (this.form.rede === 'TikTok') {
        // Padrão TikTok: POSICIONAMENTO fixo N/A (não vem do formulário)
        const parts = [
          withToken(this.form.siglaGestor), // [GESTOR]
          withToken("TTK"),                 // [REDE DE TRÁFEGO]
          withToken("N/A"),                 // [POSICIONAMENTO] fixo N/A
          withToken(this.form.ca),          // [CA]
          withToken(this.form.oferta),      // [OFERTA]
          withToken(this.form.pais),        // [PAÍS]
          withToken(adToken),               // [AD]
          withTokenKeepHyphens(this.form.estrutura),   // [ESTRUTURA]
          withToken(this.form.nomeCampanha), // [NOME DA CAMPANHA]
          withToken(formatDate(this.form.dataDiaUmRaw)), // [DATA DO DIA 1]
        ];
        return parts.join("");
      }
    },
    posicionamentosOptions() {
      if (this.form.rede === 'Facebook') {
        // Facebook não tem posicionamento, retorna array vazio
        return [];
      } else if (this.form.rede === 'TikTok') {
        // TikTok: posicionamento fixo N/A, não há opções para o usuário
        return ["N/A"];
      }
      // Google tem posicionamento: YT, Display, Search
      return this.posicionamentos;
    },
    neomoonPosicionamentosOptions() {
      if (this.formNeomoonCampaign.rede === 'Facebook') {
        return [];
      } else if (this.formNeomoonCampaign.rede === 'TikTok') {
        return ["N/A"];
      }
      return this.posicionamentos;
    },
    isValidAds() {
      const copyValue = this.formAds.copy === "NAO_INFORMADO" ? "XX" : this.formAds.copy;
      const requiredFilled = this.formAds.sequencia !== null && this.formAds.sequencia !== undefined && copyValue && this.formAds.redeTrafego && this.formAds.oferta && this.formAds.adNum && this.formAds.variacao && this.formAds.hook && this.formAds.avatar;
      const combined = `${copyValue}${this.formAds.redeTrafego}${this.formAds.oferta}${this.formAds.adNum}${this.formAds.variacao}${this.formAds.hook}${this.formAds.avatar}${this.formAds.editor}`;
      const noProhibited = !PROHIBITED_TEST.test(combined);
      const sequenciaOk = this.formAds.sequencia !== null && this.formAds.sequencia !== undefined && !isNaN(Number(this.formAds.sequencia));
      const adOk = this.formAds.adNum && this.formAds.adNum.trim().length > 0;
      return Boolean(requiredFilled && noProhibited && sequenciaOk && adOk);
    },
    previewAds() {
      // Função para limpar espaços e hífens
      const cleanValue = (value) => {
        return String(value || "").replace(/[\s-]/g, "").toUpperCase();
      };
      
      const withToken = (value) => {
        const val = cleanValue(value);
        return val ? `[${val}]` : "";
      };
      
      // Novo formato: [NÚMERO SEQUENCIAL][COPY][REDE][OFERTA][AD][V][H][A.S][EDITOR]
      const sequenciaValue = this.formAds.sequencia !== null && this.formAds.sequencia !== undefined ? String(this.formAds.sequencia) : "";
      const avatarComplete = this.formAds.avatar ? `${cleanValue(this.formAds.avatar)}.${this.formAds.avatarTipo}` : "";
      const copyValue = this.formAds.copy === "NAO_INFORMADO" ? "XX" : this.formAds.copy;
      const editorValue = cleanValue(this.formAds.editor) || "XX"; // Se não informado, usa 'XX'
      
      // Mapear Google para YT na pré-visualização, mantendo outras redes inalteradas
      const redeDisplay = this.formAds.redeTrafego === "Google" ? "YT" : (this.formAds.redeTrafego || "");
      
      // Cada campo com seus próprios colchetes
      const parts = [
        withToken(sequenciaValue),           // [NÚMERO SEQUENCIAL]
        withToken(copyValue),                // [COPY]
        withToken(redeDisplay),              // [REDE]
        withToken(this.formAds.oferta),      // [OFERTA]
        withToken(this.formAds.adNum),       // [AD]
        withToken(this.formAds.variacao),    // [V]
        withToken(this.formAds.hook),        // [H]
        withToken(avatarComplete),           // [A.S]
        withToken(editorValue),              // [EDITOR]
      ];
      
      return parts.join("");
    },
    isValidNeomoonCampaign() {
      const gestorOk = /^[A-Z]{2}$/.test(this.formNeomoonCampaign.siglaGestor || "");
      const funilValue = this.formNeomoonCampaign.funil === "OUTRO"
        ? this.formNeomoonCampaign.funilOutro
        : this.formNeomoonCampaign.funil;

      let requiredFilled;
      let combined;

      if (this.formNeomoonCampaign.rede === 'Facebook') {
        requiredFilled = gestorOk
          && this.formNeomoonCampaign.rede
          && this.formNeomoonCampaign.bm
          && this.formNeomoonCampaign.ca
          && this.formNeomoonCampaign.oferta
          && funilValue
          && this.formNeomoonCampaign.adNumCampaign
          && this.formNeomoonCampaign.estrutura
          && this.formNeomoonCampaign.estrategiaLance
          && this.formNeomoonCampaign.nomeCampanha
          && this.formNeomoonCampaign.dataDiaUmRaw;

        combined = `${this.formNeomoonCampaign.siglaGestor}${this.formNeomoonCampaign.bm}${this.formNeomoonCampaign.ca}${this.formNeomoonCampaign.oferta}${funilValue}${this.formNeomoonCampaign.adNumCampaign}${this.formNeomoonCampaign.estrutura}${this.formNeomoonCampaign.estrategiaLance}${this.formNeomoonCampaign.nomeCampanha}`;
      } else {
        const posicionamentoValue = this.formNeomoonCampaign.rede === 'TikTok'
          ? 'N/A'
          : this.formNeomoonCampaign.posicionamento;
        requiredFilled = gestorOk
          && this.formNeomoonCampaign.rede
          && posicionamentoValue
          && this.formNeomoonCampaign.ca
          && this.formNeomoonCampaign.oferta
          && funilValue
          && this.formNeomoonCampaign.adNumCampaign
          && this.formNeomoonCampaign.estrutura
          && this.formNeomoonCampaign.estrategiaLance
          && this.formNeomoonCampaign.nomeCampanha
          && this.formNeomoonCampaign.dataDiaUmRaw;

        combined = `${this.formNeomoonCampaign.siglaGestor}${posicionamentoValue}${this.formNeomoonCampaign.ca}${this.formNeomoonCampaign.oferta}${funilValue}${this.formNeomoonCampaign.adNumCampaign}${this.formNeomoonCampaign.estrutura}${this.formNeomoonCampaign.estrategiaLance}${this.formNeomoonCampaign.nomeCampanha}`;
      }

      const noProhibited = !PROHIBITED_TEST.test(combined);
      return Boolean(requiredFilled && noProhibited);
    },
    previewNeomoonCampaign() {
      const cleanValue = (value) => String(value || "").replace(/[\s-]/g, "").toUpperCase();
      const withToken = (value) => {
        const val = cleanValue(value);
        return val ? `[${val}]` : "";
      };
      const formatDate = (iso) => {
        if (!iso) return "";
        const [y,m,d] = iso.split('-');
        if (!y || !m || !d) return "";
        return `${d}/${m}/${y}`;
      };

      const redeToken = this.formNeomoonCampaign.rede === "Facebook"
        ? "FB"
        : (this.formNeomoonCampaign.rede === "TikTok" ? "TTK" : "Google");
      const bmOrPosicionamento = this.formNeomoonCampaign.rede === "Facebook"
        ? this.formNeomoonCampaign.bm
        : (this.formNeomoonCampaign.rede === "TikTok" ? "N/A" : this.formNeomoonCampaign.posicionamento);
      const funilValue = this.formNeomoonCampaign.funil === "OUTRO"
        ? this.formNeomoonCampaign.funilOutro
        : this.formNeomoonCampaign.funil;

      const parts = [
        withToken(this.formNeomoonCampaign.siglaGestor),
        withToken(redeToken),
        withToken(bmOrPosicionamento),
        withToken(this.formNeomoonCampaign.ca),
        withToken(this.formNeomoonCampaign.oferta),
        withToken(funilValue),
        withToken("US"),
        withToken(this.formNeomoonCampaign.adNumCampaign),
        withToken(this.formNeomoonCampaign.estrutura),
        withToken(this.formNeomoonCampaign.estrategiaLance),
        withToken(this.formNeomoonCampaign.nomeCampanha),
        withToken(formatDate(this.formNeomoonCampaign.dataDiaUmRaw)),
      ];

      return parts.join("");
    },
    isValidNeomoonAds() {
      const copyValue = this.formNeomoonAds.copy === "OUTRO"
        ? this.formNeomoonAds.copyOutro
        : (this.formNeomoonAds.copy === "NAO_INFORMADO" ? "XX" : this.formNeomoonAds.copy);
      const editorValue = this.formNeomoonAds.editor === "OUTRO"
        ? this.formNeomoonAds.editorOutro
        : this.formNeomoonAds.editor;

      const requiredFilled = this.formNeomoonAds.sequencia !== null
        && this.formNeomoonAds.sequencia !== undefined
        && copyValue
        && this.formNeomoonAds.redeTrafego
        && this.formNeomoonAds.oferta
        && this.formNeomoonAds.adNum
        && this.formNeomoonAds.angulo
        && this.formNeomoonAds.hook
        && this.formNeomoonAds.avatar
        && this.formNeomoonAds.avatarTipo
        && this.formNeomoonAds.tipoArquivo
        && this.formNeomoonAds.formato;
      const combined = `${copyValue}${this.formNeomoonAds.redeTrafego}${this.formNeomoonAds.oferta}${this.formNeomoonAds.adNum}${this.formNeomoonAds.angulo}${this.formNeomoonAds.hook}${this.formNeomoonAds.avatar}${this.formNeomoonAds.avatarTipo}${this.formNeomoonAds.tipoArquivo}${this.formNeomoonAds.formato}${editorValue}`;
      const noProhibited = !PROHIBITED_TEST.test(combined);
      const sequenciaOk = this.formNeomoonAds.sequencia !== null && this.formNeomoonAds.sequencia !== undefined && !isNaN(Number(this.formNeomoonAds.sequencia));
      return Boolean(requiredFilled && noProhibited && sequenciaOk);
    },
    previewNeomoonAds() {
      const cleanValue = (value) => String(value || "").replace(/[\s-]/g, "").toUpperCase();
      const withToken = (value) => {
        const val = cleanValue(value);
        return val ? `[${val}]` : "";
      };
      const sequenciaValue = this.formNeomoonAds.sequencia !== null && this.formNeomoonAds.sequencia !== undefined ? String(this.formNeomoonAds.sequencia) : "";
      const redeDisplay = this.formNeomoonAds.redeTrafego === "Google" ? "YT" : (this.formNeomoonAds.redeTrafego || "");
      const avatarComplete = this.formNeomoonAds.avatar
        ? `${cleanValue(this.formNeomoonAds.avatar)}.${cleanValue(this.formNeomoonAds.avatarTipo)}`
        : "";
      const copyValue = this.formNeomoonAds.copy === "OUTRO"
        ? this.formNeomoonAds.copyOutro
        : (this.formNeomoonAds.copy === "NAO_INFORMADO" ? "XX" : this.formNeomoonAds.copy);
      const editorRaw = this.formNeomoonAds.editor === "OUTRO"
        ? this.formNeomoonAds.editorOutro
        : this.formNeomoonAds.editor;
      const editorValue = cleanValue(editorRaw) || "XX";

      const parts = [
        withToken(sequenciaValue),
        withToken(copyValue),
        withToken(redeDisplay),
        withToken(this.formNeomoonAds.oferta),
        withToken(this.formNeomoonAds.adNum),
        withToken(this.formNeomoonAds.angulo),
        withToken(this.formNeomoonAds.hook),
        withToken(avatarComplete),
        withToken(this.formNeomoonAds.tipoArquivo),
        withToken(this.formNeomoonAds.formato),
        withToken(editorValue),
      ];

      return parts.join("");
    },
  },
  methods: {
    enforceUpper(field) {
      const current = this.form[field] ?? "";
      const sanitized = current
        .replace(/\s+/g, "") // remove todos os espaços
        .replace(PROHIBITED_REGEX, "")
        .toUpperCase();
      this.form[field] = sanitized;
    },
    enforceUpperKeepSpaces(field) {
      const current = this.form[field] ?? "";
      const sanitized = String(current)
        .replace(PROHIBITED_REGEX, "")
        .toUpperCase();
      this.form[field] = sanitized;
    },
    sanitizeFree(field) {
      const current = this.form[field] ?? "";
      // Remove todos os espaços e caracteres proibidos
      const sanitized = current
        .replace(/\s+/g, "")
        .replace(PROHIBITED_REGEX, "")
        .toUpperCase();
      this.form[field] = sanitized;
    },
    enforceUpperAds(field) {
      const current = this.formAds[field] ?? "";
      const sanitized = String(current)
        .replace(/\s+/g, "")
        .replace(PROHIBITED_REGEX, "")
        .toUpperCase();
      this.formAds[field] = sanitized;
    },
    enforceUpperNeomoonCampaign(field) {
      const current = this.formNeomoonCampaign[field] ?? "";
      const sanitized = String(current)
        .replace(/\s+/g, "")
        .replace(PROHIBITED_REGEX, "")
        .toUpperCase();
      this.formNeomoonCampaign[field] = sanitized;
    },
    enforceUpperTwoLettersNeomoonGestor() {
      const current = this.formNeomoonCampaign.siglaGestor ?? "";
      const sanitized = String(current)
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase()
        .slice(0, 2);
      this.formNeomoonCampaign.siglaGestor = sanitized;
    },
    enforceUpperNeomoonAds(field) {
      const current = this.formNeomoonAds[field] ?? "";
      const sanitized = String(current)
        .replace(/\s+/g, "")
        .replace(PROHIBITED_REGEX, "")
        .toUpperCase();
      this.formNeomoonAds[field] = sanitized;
    },
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.preview);
        this.showToast("Texto copiado com sucesso!");
        this.copied = true;
        setTimeout(() => (this.copied = false), 1500);
      } catch (e) {
        console.error(e);
        this.showToast("Erro ao copiar texto", "error");
      }
    },
    async copyAds() {
      try {
        await navigator.clipboard.writeText(this.previewAds);
        this.showToast("Texto copiado com sucesso!");
        this.copied = true;
        setTimeout(() => (this.copied = false), 1500);
      } catch (e) {
        console.error(e);
        this.showToast("Erro ao copiar texto", "error");
      }
    },
    async copyNeomoonCampaign() {
      try {
        await navigator.clipboard.writeText(this.previewNeomoonCampaign);
        this.showToast("Texto copiado com sucesso!");
        this.copied = true;
        setTimeout(() => (this.copied = false), 1500);
      } catch (e) {
        console.error(e);
        this.showToast("Erro ao copiar texto", "error");
      }
    },
    async copyNeomoonAds() {
      try {
        await navigator.clipboard.writeText(this.previewNeomoonAds);
        this.showToast("Texto copiado com sucesso!");
        this.copied = true;
        setTimeout(() => (this.copied = false), 1500);
      } catch (e) {
        console.error(e);
        this.showToast("Erro ao copiar texto", "error");
      }
    },
    toggleTooltip(event) {
      event.preventDefault();
      event.stopPropagation();
      
      // Remove active de todos os tooltips
      document.querySelectorAll('.field-with-tooltip.active').forEach(el => {
        el.classList.remove('active');
      });
      
      // Adiciona active apenas no tooltip clicado
      const tooltipElement = event.target.closest('.field-with-tooltip');
      if (tooltipElement) {
        tooltipElement.classList.add('active');
      }
    },
    hideAllTooltips() {
      // Remove active de todos os tooltips
      document.querySelectorAll('.field-with-tooltip.active').forEach(el => {
        el.classList.remove('active');
      });
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme();
      // Salva a preferência no localStorage
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    },
    applyTheme() {
      const html = document.documentElement;
      if (this.isDarkMode) {
        html.removeAttribute('data-theme');
      } else {
        html.setAttribute('data-theme', 'light');
      }
    },
    loadTheme() {
      // Carrega a preferência salva no localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        this.isDarkMode = false;
      } else if (savedTheme === 'dark') {
        this.isDarkMode = true;
      } else {
        // Se não há preferência salva, detecta a preferência do sistema
        this.isDarkMode = !window.matchMedia('(prefers-color-scheme: light)').matches;
      }
      this.applyTheme();
    },
    showToast(message, type = "success") {
      // Remove toast existente se houver
      const existingToast = document.querySelector('.toast');
      if (existingToast) {
        existingToast.remove();
      }
      
      // Cria novo toast
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      
      if (type === "error") {
        toast.style.background = 'var(--danger)';
        toast.style.setProperty('--toast-icon', '❌');
      }
      
      document.body.appendChild(toast);
      
      // Mostra o toast
      setTimeout(() => toast.classList.add('show'), 100);
      
      // Remove o toast após 3 segundos
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  },
  mounted() {
    // Carrega o tema salvo ou detecta a preferência do sistema
    this.loadTheme();
    
    // Adiciona event listener para cliques fora dos tooltips
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.field-with-tooltip')) {
        this.hideAllTooltips();
      }
    });

    // Escuta mudanças na preferência de tema do sistema
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.isDarkMode = !e.matches;
        this.applyTheme();
      }
    });

    // Desabilita menu de contexto (clique direito) na pré-visualização
    document.addEventListener('contextmenu', (event) => {
      if (event.target.closest('.preview-text')) {
        event.preventDefault();
        return false;
      }
    });

    // Desabilita atalhos de teclado (Ctrl+C, Ctrl+A, etc.) na pré-visualização
    document.addEventListener('keydown', (event) => {
      // Verifica se o foco está na área de pré-visualização ou se o elemento ativo é a pré-visualização
      const previewElement = event.target.closest('.preview-text') || document.activeElement.closest('.preview-text');
      
      if (previewElement) {
        // Desabilita Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+V
        if (event.ctrlKey && (event.key === 'c' || event.key === 'a' || event.key === 'x' || event.key === 'v')) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
        // Desabilita F12 (DevTools)
        if (event.key === 'F12') {
          event.preventDefault();
          return false;
        }
      }
    });

    // Adiciona tabindex para tornar a pré-visualização focável e capturar eventos de teclado
    this.$nextTick(() => {
      const previewElements = document.querySelectorAll('.preview-text');
      previewElements.forEach(element => {
        element.setAttribute('tabindex', '0');
      });
    });
  },
  watch: {
    'form.rede'(val) {
      const opts = this.posicionamentosOptions;
      if (!opts.includes(this.form.posicionamento)) {
        this.form.posicionamento = opts[0] || '';
      }
      // Reset BM quando muda para Google (não é usado)
      if (val === 'Google') {
        this.form.bm = '';
      }
      // Reset posicionamento quando muda para Facebook (não é usado)
      if (val === 'Facebook') {
        this.form.posicionamento = '';
      }
      // Quando rede for TikTok, força posicionamento N/A
      if (val === 'TikTok') {
        this.form.posicionamento = 'N/A';
      }
    },
    'formNeomoonCampaign.rede'(val) {
      const opts = this.neomoonPosicionamentosOptions;
      if (!opts.includes(this.formNeomoonCampaign.posicionamento)) {
        this.formNeomoonCampaign.posicionamento = opts[0] || '';
      }
      if (val === 'Google') {
        this.formNeomoonCampaign.bm = '';
      }
      if (val === 'Facebook') {
        this.formNeomoonCampaign.posicionamento = '';
      }
      if (val === 'TikTok') {
        this.formNeomoonCampaign.posicionamento = 'N/A';
      }
    },
    'formNeomoonCampaign.funil'(val) {
      if (val !== 'OUTRO') {
        this.formNeomoonCampaign.funilOutro = '';
      }
    },
    'formNeomoonAds.copy'(val) {
      if (val !== 'OUTRO') {
        this.formNeomoonAds.copyOutro = '';
      }
    },
    'formNeomoonAds.editor'(val) {
      if (val !== 'OUTRO') {
        this.formNeomoonAds.editorOutro = '';
      }
    }
  }
}).mount('#app');


// Removido ajuste por escala para permitir scroll natural da página.
