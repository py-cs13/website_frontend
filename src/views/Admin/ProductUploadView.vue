<template>
  <div class="product-upload-page">
    <div class="page-header">
      <h1>商品数据上传</h1>
      <p>添加新的推广商品到系统</p>
    </div>

    <div class="upload-form">
      <form @submit.prevent="submitForm">
        <!-- 商品名称 -->
        <div class="form-group">
          <label for="name">商品名称 *</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            placeholder="请输入商品名称"
            required
          />
        </div>

        <!-- 商品分类 -->
        <div class="form-group">
          <label for="category">商品分类 *</label>
          <select id="category" v-model="formData.category" required>
            <option value="">请选择分类</option>
            <option value="孕期指南">孕期指南</option>
            <option value="新生照顾">新生照顾</option>
            <option value="幼儿发展">幼儿发展</option>
            <option value="亲子互动">亲子互动</option>
            <option value="早期教育">早期教育</option>
            <option value="营养健康">营养健康</option>
            <option value="产后恢复">产后恢复</option>
            <option value="育儿用品">育儿用品</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <!-- 商品描述 -->
        <div class="form-group">
          <label for="description">商品描述</label>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="请输入商品描述信息"
            rows="3"
          ></textarea>
        </div>

        <!-- 商品价格 -->
        <div class="form-group">
          <label for="price">商品价格 *</label>
          <input
            type="number"
            id="price"
            v-model="formData.price"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <!-- 商品图片链接 -->
        <div class="form-group">
          <label for="image_url">商品图片链接 *</label>
          <input
            type="url"
            id="image_url"
            v-model="formData.image_url"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <!-- 淘宝联盟链接 -->
        <div class="form-group">
          <label for="link_url">淘宝联盟链接 *</label>
          <input
            type="url"
            id="link_url"
            v-model="formData.link_url"
            placeholder="https://s.click.taobao.com/xxx"
            required
          />
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <button type="submit" class="btn-primary">上传商品</button>
          <button type="button" @click="resetForm" class="btn-secondary">重置</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import Swal from 'sweetalert2'
import apiClient from '@/utils/api.js'

export default {
  name: 'ProductUploadView',
  setup() {
    const formData = reactive({
      name: '',
      description: '',
      image_url: '',
      link_url: '',
      price: '',
      category: ''
    })

    const submitForm = async () => {
      try {
        const response = await apiClient.post('/products', {
          name: formData.name,
          description: formData.description,
          image_url: formData.image_url,
          link_url: formData.link_url,
          price: parseFloat(formData.price),
          category: formData.category
        })

        Swal.fire({
          icon: 'success',
          title: '上传成功',
          text: `商品"${formData.name}"已成功添加到系统`
        })

        resetForm()

      } catch (error) {
        console.error('上传商品失败:', error)
        
        let errorMessage = '上传失败，请稍后重试'
        if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail
        }

        Swal.fire({
          icon: 'error',
          title: '上传失败',
          text: errorMessage
        })
      }
    }

    const resetForm = () => {
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
    }

    return {
      formData,
      submitForm,
      resetForm
    }
  }
}
</script>

<style scoped>
.product-upload-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 1rem;
}

.upload-form {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}
</style>